const ALLOWED_HOSTS = new Set([
  "meli.la",
  "www.mercadolibre.com.mx",
  "mercadolibre.com.mx",
  "articulo.mercadolibre.com.mx",
  "listado.mercadolibre.com.mx",
]);

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
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

async function fetchMl(path, token) {
  const response = await fetch(`https://api.mercadolibre.com${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.message || data?.error || `Error ${response.status}`;
    const error = new Error(detail);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }
  return data;
}

function getAttribute(item, id) {
  return item?.attributes?.find((attribute) => attribute.id === id)?.value_name || "";
}

function elegirPrecioPublicado(pricesResponse, salePriceResponse) {
  // sale_price es el valor exacto que Mercado Libre publica en marketplace.
  if (Number.isFinite(Number(salePriceResponse?.amount))) {
    return {
      actual: Number(salePriceResponse.amount),
      anterior: Number.isFinite(Number(salePriceResponse.regular_amount))
        ? Number(salePriceResponse.regular_amount)
        : null,
      moneda: salePriceResponse.currency_id || "MXN",
      fuentePrecio: "sale_price",
    };
  }

  const prices = Array.isArray(pricesResponse?.prices) ? pricesResponse.prices : [];
  const marketplace = prices.filter((price) => {
    const restrictions = price?.conditions?.context_restrictions;
    return !Array.isArray(restrictions) || restrictions.length === 0 || restrictions.includes("channel_marketplace");
  });

  const promotion = marketplace.find((price) => price?.type === "promotion" && Number.isFinite(Number(price?.amount)));
  const standard = marketplace.find((price) => price?.type === "standard" && Number.isFinite(Number(price?.amount)));
  const selected = promotion || standard;
  if (!selected) return null;

  return {
    actual: Number(selected.amount),
    anterior: Number.isFinite(Number(selected.regular_amount))
      ? Number(selected.regular_amount)
      : (promotion && Number.isFinite(Number(standard?.amount)) ? Number(standard.amount) : null),
    moneda: selected.currency_id || "MXN",
    fuentePrecio: "prices",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const enlace = String(body.enlace || "").trim();
    const itemIdDirecto = normalizeItemId(body.item_id || "");

    if (!enlace && !itemIdDirecto) {
      return json(res, 400, { error: "Falta la URL o el ITEM_ID de Mercado Libre." });
    }

    const resolvedUrl = enlace
      ? await resolveUrl(enlace)
      : `https://articulo.mercadolibre.com.mx/${itemIdDirecto}`;
    const itemId = itemIdDirecto || normalizeItemId(resolvedUrl) || normalizeItemId(enlace);

    if (!itemId) {
      return json(res, 400, { error: "No fue posible identificar el código MLM de la publicación." });
    }

    const token = process.env.MERCADOLIBRE_ACCESS_TOKEN || process.env.ML_ACCESS_TOKEN || "";
    if (!token) {
      return json(res, 503, {
        error: "La consulta de precio aún no está conectada a Mercado Libre. Configura MERCADOLIBRE_ACCESS_TOKEN en Vercel y vuelve a consultar.",
        code: "ML_TOKEN_MISSING",
        item_id: itemId,
      });
    }

    // 1) Precios: endpoint oficial vigente de Mercado Libre.
    // 2) sale_price: precio exacto mostrado en marketplace cuando está disponible.
    const [pricesResult, salePriceResult, itemResult] = await Promise.allSettled([
      fetchMl(`/items/${itemId}/prices`, token),
      fetchMl(`/items/${itemId}/sale_price?context=channel_marketplace`, token),
      fetchMl(`/items/${itemId}`, token),
    ]);

    const prices = pricesResult.status === "fulfilled" ? pricesResult.value : null;
    const salePrice = salePriceResult.status === "fulfilled" ? salePriceResult.value : null;
    const item = itemResult.status === "fulfilled" ? itemResult.value : null;
    const precio = elegirPrecioPublicado(prices, salePrice);

    if (!precio) {
      const possibleErrors = [salePriceResult, pricesResult, itemResult]
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason);
      const authError = possibleErrors.find((error) => error?.status === 401 || error?.status === 403);
      if (authError) {
        return json(res, 401, {
          error: "Mercado Libre rechazó el token. Genera un ACCESS_TOKEN vigente y actualiza MERCADOLIBRE_ACCESS_TOKEN en Vercel.",
          code: "ML_TOKEN_INVALID",
          item_id: itemId,
        });
      }
      throw possibleErrors[0] || new Error("Mercado Libre no devolvió un precio vigente para esta publicación.");
    }

    const image = item?.pictures?.[0]?.secure_url || item?.secure_thumbnail || item?.thumbnail || "";

    return json(res, 200, {
      item_id: itemId,
      titulo: item?.title || "",
      enlace: item?.permalink || resolvedUrl,
      imagen: image,
      imagenes: Array.isArray(item?.pictures)
        ? item.pictures.map((picture) => picture.secure_url || picture.url).filter(Boolean)
        : [],
      precio_actual: precio.actual,
      precio_anterior: precio.anterior,
      moneda: precio.moneda,
      marca: getAttribute(item, "BRAND"),
      modelo: getAttribute(item, "MODEL"),
      vendidos: item?.sold_quantity ?? null,
      disponible: item ? item.status === "active" : null,
      estado: item?.status || "",
      advertencia: "Precio actualizado directamente desde la API de Mercado Libre.",
      fuente: "api",
      fuente_precio: precio.fuentePrecio,
      consultado_en: new Date().toISOString(),
    });
  } catch (error) {
    const status = Number(error?.status) >= 400 && Number(error?.status) < 500 ? Number(error.status) : 500;
    return json(res, status, {
      error: error?.message ? `No se pudo actualizar el precio: ${error.message}` : "No se pudo actualizar el precio desde Mercado Libre.",
      code: "ML_QUERY_FAILED",
    });
  }
}
