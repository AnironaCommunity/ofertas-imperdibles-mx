const ALLOWED_HOSTS = new Set([
  "meli.la",
  "www.mercadolibre.com.mx",
  "mercadolibre.com.mx",
  "articulo.mercadolibre.com.mx",
  "listado.mercadolibre.com.mx",
]);

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function normalizeItemId(value = "") {
  const match = String(value).toUpperCase().match(/MLM[-_ ]?(\d{6,})/);
  return match ? `MLM${match[1]}` : "";
}

function assertMercadoLibreUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("El enlace de Mercado Libre no es válido.");
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname.toLowerCase())) {
    throw new Error("Utiliza un enlace válido de Mercado Libre México o meli.la.");
  }
  return url;
}

async function resolveUrl(inputUrl) {
  const initial = assertMercadoLibreUrl(inputUrl);
  if (initial.hostname !== "meli.la") return initial.toString();

  const response = await fetch(initial, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 OfertasImperdiblesMX/1.0" },
  });
  const finalUrl = response.url || initial.toString();
  assertMercadoLibreUrl(finalUrl);
  return finalUrl;
}

function getAttribute(item, id) {
  return item?.attributes?.find((attribute) => attribute.id === id)?.value_name || "";
}

async function fetchMl(path, token = "") {
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.mercadolibre.com${path}`, { headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data?.message || data?.error || `Error ${response.status}`;
    const error = new Error(`Mercado Libre respondió: ${detail}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }

  return data;
}

function isUnauthorizedError(error) {
  const detail = String(error?.detail || error?.message || "").toUpperCase();
  return error?.status === 401 || error?.status === 403 || detail.includes("UNAUTHORIZED");
}

async function fetchPublicItem(itemId, token) {
  if (!token) return fetchMl(`/items/${itemId}`);

  try {
    return await fetchMl(`/items/${itemId}`, token);
  } catch (error) {
    // Algunos tokens no tienen permiso sobre publicaciones de otros vendedores.
    // La ficha pública del artículo se vuelve a consultar sin autorización.
    if (isUnauthorizedError(error)) return fetchMl(`/items/${itemId}`);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const enlace = String(body.enlace || "").trim();
    if (!enlace) return json(res, 400, { error: "Falta el enlace de Mercado Libre." });

    const resolvedUrl = await resolveUrl(enlace);
    const itemId = normalizeItemId(resolvedUrl) || normalizeItemId(enlace);
    if (!itemId) {
      return json(res, 400, { error: "No fue posible identificar el código MLM de la publicación." });
    }

    const token = process.env.MERCADOLIBRE_ACCESS_TOKEN || process.env.ML_ACCESS_TOKEN || "";
    const item = await fetchPublicItem(itemId, token);

    let salePrice = null;
    let priceWarning = "";
    if (token) {
      try {
        salePrice = await fetchMl(`/items/${itemId}/sale_price?context=channel_marketplace`, token);
      } catch (error) {
        priceWarning = isUnauthorizedError(error)
          ? "Producto encontrado. Mercado Libre no autorizó consultar el precio con el token configurado."
          : error.message;
      }
    } else {
      priceWarning = "Para consultar siempre el precio actual configura MERCADOLIBRE_ACCESS_TOKEN en Vercel.";
    }

    const currentPrice = salePrice?.amount ?? item?.price ?? null;
    const regularPrice = salePrice?.regular_amount ?? item?.original_price ?? null;
    const image = item?.pictures?.[0]?.secure_url || item?.secure_thumbnail || item?.thumbnail || "";

    return json(res, 200, {
      item_id: itemId,
      titulo: item?.title || "",
      enlace: item?.permalink || resolvedUrl,
      imagen: image,
      imagenes: Array.isArray(item?.pictures) ? item.pictures.map((picture) => picture.secure_url || picture.url).filter(Boolean) : [],
      precio_actual: currentPrice,
      precio_anterior: regularPrice,
      moneda: salePrice?.currency_id || item?.currency_id || "MXN",
      marca: getAttribute(item, "BRAND"),
      modelo: getAttribute(item, "MODEL"),
      vendidos: item?.sold_quantity ?? null,
      disponible: item?.status === "active",
      estado: item?.status || "",
      advertencia: priceWarning,
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "No fue posible consultar Mercado Libre." });
  }
}
