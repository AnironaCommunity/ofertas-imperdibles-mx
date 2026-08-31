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

function decodeHtml(value = "") {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function metaContent(html, key, attribute = "property") {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+${attribute}=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attribute}=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1]).trim();
  }
  return "";
}

function readJsonLdProducts(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const products = [];
  for (const script of scripts) {
    try {
      const parsed = JSON.parse(decodeHtml(script[1]).trim());
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      for (const entry of entries) {
        if (entry?.["@graph"] && Array.isArray(entry["@graph"])) entries.push(...entry["@graph"]);
        if (String(entry?.["@type"] || "").toLowerCase() === "product") products.push(entry);
      }
    } catch {
      // Algunos scripts JSON-LD de terceros no contienen JSON válido.
    }
  }
  return products;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

async function fetchPageFallback(url, itemId) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "es-MX,es;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
    },
  });

  if (!response.ok) throw new Error(`No fue posible abrir la publicación (${response.status}).`);
  const html = await response.text();
  const product = readJsonLdProducts(html)[0] || {};
  const offer = Array.isArray(product.offers) ? product.offers[0] : (product.offers || {});

  const title = product.name || metaContent(html, "og:title") || metaContent(html, "twitter:title", "name");
  const imageValue = product.image || metaContent(html, "og:image") || metaContent(html, "twitter:image", "name");
  const images = Array.isArray(imageValue) ? imageValue.filter(Boolean) : (imageValue ? [imageValue] : []);
  const price = numberOrNull(offer.price ?? offer.lowPrice ?? metaContent(html, "product:price:amount"));
  const currency = offer.priceCurrency || metaContent(html, "product:price:currency") || "MXN";
  const brand = typeof product.brand === "string" ? product.brand : (product.brand?.name || "");
  const availabilityText = String(offer.availability || "").toLowerCase();

  if (!title && !images.length) {
    throw new Error("Mercado Libre bloqueó la consulta y la página pública no expuso datos del producto.");
  }

  return {
    id: itemId,
    title: title || "",
    permalink: response.url || url,
    pictures: images.map((secure_url) => ({ secure_url })),
    price,
    original_price: null,
    currency_id: currency,
    attributes: [
      ...(brand ? [{ id: "BRAND", value_name: brand }] : []),
      ...(product.model ? [{ id: "MODEL", value_name: product.model }] : []),
    ],
    sold_quantity: null,
    status: availabilityText.includes("instock") || availabilityText.includes("instoreonly") ? "active" : "",
    __fallback: true,
  };
}

async function fetchItemWithFallback(itemId, token, resolvedUrl) {
  let lastError = null;

  if (token) {
    try {
      return await fetchMl(`/items/${itemId}`, token);
    } catch (error) {
      lastError = error;
      if (!isUnauthorizedError(error)) throw error;
    }
  }

  try {
    return await fetchMl(`/items/${itemId}`);
  } catch (error) {
    lastError = error;
    if (!isUnauthorizedError(error)) throw error;
  }

  try {
    return await fetchPageFallback(resolvedUrl, itemId);
  } catch (fallbackError) {
    const message = fallbackError?.message || lastError?.message || "No fue posible consultar Mercado Libre.";
    const error = new Error(message);
    error.status = fallbackError?.status || lastError?.status || 500;
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
    const item = await fetchItemWithFallback(itemId, token, resolvedUrl);

    let salePrice = null;
    let priceWarning = "";
    if (token && !item.__fallback) {
      try {
        salePrice = await fetchMl(`/items/${itemId}/sale_price?context=channel_marketplace`, token);
      } catch (error) {
        priceWarning = isUnauthorizedError(error)
          ? "Producto encontrado. Mercado Libre no autorizó consultar el precio detallado con el token configurado."
          : error.message;
      }
    } else if (item.__fallback) {
      priceWarning = "Datos recuperados desde la página pública porque la API de Mercado Libre rechazó el acceso.";
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
      fuente: item.__fallback ? "pagina_publica" : "api",
    });
  } catch (error) {
    const status = Number(error?.status) >= 400 && Number(error?.status) < 500 ? Number(error.status) : 500;
    return json(res, status, { error: error.message || "No fue posible consultar Mercado Libre." });
  }
}
