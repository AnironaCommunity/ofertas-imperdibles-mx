const ALLOWED_HOSTS = new Set([
  "meli.la",
  "www.mercadolibre.com.mx",
  "mercadolibre.com.mx",
  "articulo.mercadolibre.com.mx",
  "listado.mercadolibre.com.mx",
]);

// Cache simple por instancia serverless. Evita repetir la misma consulta durante 30 min.
const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = globalThis.__ofertasMlPublicCache || new Map();
globalThis.__ofertasMlPublicCache = cache;

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
  try { url = new URL(raw); } catch { throw new Error("El enlace de Mercado Libre no es válido."); }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname.toLowerCase())) {
    throw new Error("Utiliza un enlace válido de Mercado Libre México o meli.la.");
  }
  return url;
}

function browserHeaders(accept = "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8") {
  return {
    Accept: accept,
    "Accept-Language": "es-MX,es;q=0.9,en;q=0.7",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

async function resolveUrl(inputUrl) {
  const initial = assertMercadoLibreUrl(inputUrl);
  if (initial.hostname !== "meli.la") return initial.toString();

  const response = await fetchWithTimeout(initial, {
    method: "GET",
    redirect: "follow",
    headers: browserHeaders(),
  });
  const finalUrl = response.url || initial.toString();
  assertMercadoLibreUrl(finalUrl);
  return finalUrl;
}

async function fetchJson(url, token = "") {
  const headers = browserHeaders("application/json");
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetchWithTimeout(url, { headers, redirect: "follow" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    const error = new Error(data?.message || data?.error || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  let text = String(value).trim().replace(/\s/g, "");
  if (!text) return null;
  // 1,596.65 / 1.596,65 / 1596.65
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) text = text.replace(/,/g, "");
  else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(text)) text = text.replace(/\./g, "").replace(",", ".");
  else if (text.includes(",") && !text.includes(".")) text = text.replace(",", ".");
  text = text.replace(/[^0-9.-]/g, "");
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getAttribute(item, id) {
  return item?.attributes?.find((attribute) => attribute.id === id)?.value_name || "";
}

function pickFromItemApi(item) {
  if (!item) return null;
  const sale = numberOrNull(item?.sale_price?.amount);
  const price = sale ?? numberOrNull(item?.price) ?? numberOrNull(item?.base_price);
  if (!price) return null;
  const regular = numberOrNull(item?.sale_price?.regular_amount) ?? numberOrNull(item?.original_price);
  return {
    precio_actual: price,
    precio_anterior: regular && regular > price ? regular : null,
    moneda: item?.currency_id || item?.sale_price?.currency_id || "MXN",
    titulo: item?.title || "",
    enlace: item?.permalink || "",
    imagen: item?.pictures?.[0]?.secure_url || item?.secure_thumbnail || item?.thumbnail || "",
    imagenes: Array.isArray(item?.pictures) ? item.pictures.map(p => p.secure_url || p.url).filter(Boolean) : [],
    marca: getAttribute(item, "BRAND"),
    modelo: getAttribute(item, "MODEL"),
    vendidos: item?.sold_quantity ?? null,
    disponible: item?.status ? item.status === "active" : null,
    estado: item?.status || "",
    fuente: "api_publica",
  };
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&quot;/g, '"').replace(/&#34;/g, '"').replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function metaContent(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const a = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i").exec(html);
  const b = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i").exec(html);
  return decodeHtml(a?.[1] || b?.[1] || "");
}

function collectJsonLd(html) {
  const list = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html))) {
    try {
      const parsed = JSON.parse(decodeHtml(match[1]).trim());
      if (Array.isArray(parsed)) list.push(...parsed); else list.push(parsed);
    } catch {}
  }
  return list;
}

function findProductNode(nodes) {
  const queue = [...nodes];
  while (queue.length) {
    const node = queue.shift();
    if (!node || typeof node !== "object") continue;
    const type = node["@type"];
    if (type === "Product" || (Array.isArray(type) && type.includes("Product"))) return node;
    if (Array.isArray(node["@graph"])) queue.push(...node["@graph"]);
    if (Array.isArray(node.itemListElement)) queue.push(...node.itemListElement.map(x => x?.item || x));
  }
  return null;
}

function parseHtmlProduct(html, finalUrl = "") {
  const product = findProductNode(collectJsonLd(html));
  const offers = Array.isArray(product?.offers) ? product.offers[0] : product?.offers;
  const price = numberOrNull(offers?.price) || numberOrNull(offers?.lowPrice)
    || numberOrNull(metaContent(html, "product:price:amount"))
    || numberOrNull(metaContent(html, "og:price:amount"));

  if (!price) return null;

  const imageNode = Array.isArray(product?.image) ? product.image[0] : product?.image;
  const image = typeof imageNode === "string" ? imageNode : (imageNode?.url || metaContent(html, "og:image"));
  const title = product?.name || metaContent(html, "og:title") || "";
  const currency = offers?.priceCurrency || metaContent(html, "product:price:currency") || "MXN";

  // Mercado Libre suele publicar el precio anterior en JSON embebido cuando hay descuento.
  const regularPatterns = [
    /"regular_amount"\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
    /"original_price"\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
    /"originalPrice"\s*:\s*([0-9]+(?:\.[0-9]+)?)/i,
  ];
  let previous = null;
  for (const pattern of regularPatterns) {
    const m = pattern.exec(html);
    const candidate = numberOrNull(m?.[1]);
    if (candidate && candidate > price) { previous = candidate; break; }
  }

  return {
    precio_actual: price,
    precio_anterior: previous,
    moneda: currency,
    titulo: decodeHtml(title),
    enlace: finalUrl,
    imagen: image || "",
    imagenes: image ? [image] : [],
    marca: typeof product?.brand === "string" ? product.brand : (product?.brand?.name || ""),
    modelo: product?.model || "",
    vendidos: null,
    disponible: offers?.availability ? !/OutOfStock/i.test(String(offers.availability)) : null,
    estado: "",
    fuente: "pagina_publica",
  };
}

async function tryPublicItemApi(itemId, token = "") {
  const item = await fetchJson(`https://api.mercadolibre.com/items/${itemId}`, token);
  return pickFromItemApi(item);
}

async function tryPublicPage(url) {
  const response = await fetchWithTimeout(url, { headers: browserHeaders(), redirect: "follow" });
  if (!response.ok) {
    const error = new Error(`La página pública respondió HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const html = await response.text();
  const parsed = parseHtmlProduct(html, response.url || url);
  if (!parsed) throw new Error("La página pública abrió, pero no expuso un precio reconocible.");
  return parsed;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Método no permitido." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const enlace = String(body.enlace || "").trim();
    const itemIdDirecto = normalizeItemId(body.item_id || "");

    if (!enlace && !itemIdDirecto) return json(res, 400, { error: "Falta la URL o el ITEM_ID de Mercado Libre." });

    let resolvedUrl = "";
    let resolveWarning = "";
    if (enlace) {
      try { resolvedUrl = await resolveUrl(enlace); }
      catch (error) {
        resolveWarning = error?.message || "No se pudo resolver el enlace.";
        // Si la URL ya contiene MLM podemos continuar aunque Mercado Libre bloquee la redirección.
        resolvedUrl = enlace;
      }
    }

    const itemId = itemIdDirecto || normalizeItemId(resolvedUrl) || normalizeItemId(enlace);
    if (!itemId) return json(res, 400, { error: "No fue posible identificar el código MLM. Para esta prueba usa una URL completa que contenga MLM-... o pega el ITEM_ID." });

    const cacheKey = `${itemId}|${resolvedUrl || ""}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return json(res, 200, { ...cached.data, cache: true });
    }

    const token = process.env.MERCADOLIBRE_ACCESS_TOKEN || process.env.ML_ACCESS_TOKEN || "";
    const attempts = [];
    let result = null;

    // 1) API pública. No requiere conectar la cuenta si Mercado Libre permite la lectura de ese item.
    try {
      result = await tryPublicItemApi(itemId, "");
      if (result) attempts.push("API pública: OK");
    } catch (error) {
      attempts.push(`API pública: ${error.status || "error"}`);
    }

    // 2) Si en algún momento se configura token, lo aprovechamos como respaldo, pero NO es obligatorio.
    if (!result && token) {
      try {
        result = await tryPublicItemApi(itemId, token);
        if (result) { result.fuente = "api_autenticada_respaldo"; attempts.push("API autenticada: OK"); }
      } catch (error) { attempts.push(`API autenticada: ${error.status || "error"}`); }
    }

    // 3) Página pública/JSON-LD. Es el modo experimental sin cuenta.
    if (!result && resolvedUrl && !/meli\.la/i.test(resolvedUrl)) {
      try {
        result = await tryPublicPage(resolvedUrl);
        if (result) attempts.push("Página pública: OK");
      } catch (error) { attempts.push(`Página pública: ${error.status || "error"}`); }
    }

    // 4) Último intento con URL genérica del artículo, útil cuando solo se captura ITEM_ID.
    if (!result) {
      const genericUrl = `https://articulo.mercadolibre.com.mx/${itemId.replace("MLM", "MLM-")}-_JM`;
      try {
        result = await tryPublicPage(genericUrl);
        if (result) attempts.push("Página genérica: OK");
      } catch (error) { attempts.push(`Página genérica: ${error.status || "error"}`); }
    }

    if (!result) {
      return json(res, 502, {
        error: "No se pudo leer el precio público de esta publicación. Mercado Libre bloqueó o no expuso el dato en los métodos de prueba. El precio que ya tienes capturado NO fue modificado.",
        code: "ML_PUBLIC_QUERY_FAILED",
        item_id: itemId,
        intentos: attempts,
        sugerencia: "Prueba con la URL completa de la publicación (articulo.mercadolibre.com.mx/MLM-...) en lugar de meli.la.",
      });
    }

    const payload = {
      item_id: itemId,
      titulo: result.titulo || "",
      enlace: result.enlace || resolvedUrl || enlace,
      imagen: result.imagen || "",
      imagenes: result.imagenes || [],
      precio_actual: result.precio_actual,
      precio_anterior: result.precio_anterior ?? null,
      moneda: result.moneda || "MXN",
      marca: result.marca || "",
      modelo: result.modelo || "",
      vendidos: result.vendidos ?? null,
      disponible: result.disponible ?? null,
      estado: result.estado || "",
      fuente: result.fuente,
      modo: "experimental_sin_cuenta",
      advertencia: "Consulta experimental de información pública. No usa permisos de tu cuenta de Mercado Libre y puede dejar de funcionar si Mercado Libre cambia sus bloqueos o su página.",
      resolucion_aviso: resolveWarning || "",
      intentos: attempts,
      consultado_en: new Date().toISOString(),
      cache: false,
    };

    cache.set(cacheKey, { at: Date.now(), data: payload });
    return json(res, 200, payload);
  } catch (error) {
    return json(res, 500, {
      error: error?.message ? `No se pudo consultar Mercado Libre: ${error.message}` : "No se pudo consultar Mercado Libre.",
      code: "ML_PUBLIC_QUERY_EXCEPTION",
    });
  }
}
