
function authorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") === process.env.ADMIN_PASSWORD;
}

function supabaseConfig() {
  return {
    url: String(process.env.SUPABASE_URL || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/, ""),
    key: process.env.SUPABASE_SECRET_KEY,
  };
}

async function supabase(path, options = {}) {
  const { url, key } = supabaseConfig();
  if (!url || !key) throw new Error("Faltan variables de Supabase.");

  const result = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await result.text();
  const data = text ? JSON.parse(text) : null;

  if (!result.ok) {
    throw new Error(data?.message || data?.error || "Supabase rechazó la operación.");
  }

  return data;
}

function numberFromText(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value || "")
    .replace(/[^\d.,-]/g, "")
    .replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function money(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function extractItemId(value) {
  const text = String(value || "").toUpperCase();
  const compact = text.match(/\b(MLM)[-_]?(\d{6,})\b/);
  if (compact) return `${compact[1]}${compact[2]}`;

  const pathStyle = text.match(/\/P\/(MLM\d{6,})/);
  if (pathStyle) return pathStyle[1];

  return "";
}

async function resolveUrl(inputUrl) {
  const url = new URL(inputUrl);
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OfertasImperdiblesMX/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  return {
    finalUrl: response.url || inputUrl,
    html: await response.text(),
  };
}

function metaContent(html, property) {
  const safe = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${safe}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${safe}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${safe}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].replace(/&amp;/g, "&");
  }

  return "";
}

async function getMercadoLibreItem(itemId) {
  const headers = { Accept: "application/json" };
  const token = String(process.env.MERCADOLIBRE_ACCESS_TOKEN || "").trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
    headers,
  });

  if (!response.ok) return null;
  return response.json();
}

function couponDiscount(coupon, price) {
  const minimum = numberFromText(coupon.compra_minima);
  if (!coupon.activo || price < minimum) return null;

  const title = String(coupon.titulo || "").toUpperCase();
  const maximum = numberFromText(coupon.ahorro_maximo);
  const percent = title.match(/(\d+(?:\.\d+)?)\s*%/);
  const fixed = title.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*(?:OFF|DE DESCUENTO)/);

  let discount = 0;

  if (percent) {
    discount = price * (Number(percent[1]) / 100);
    if (maximum > 0) discount = Math.min(discount, maximum);
  } else if (fixed) {
    discount = numberFromText(fixed[1]);
  } else if (maximum > 0) {
    discount = maximum;
  }

  discount = Math.max(0, Math.min(discount, price));
  if (discount <= 0) return null;

  return {
    codigo: String(coupon.codigo || "").trim(),
    descuento: discount,
    precio_final: price - discount,
    compra_minima: minimum,
    titulo: coupon.titulo,
  };
}

async function bestCoupon(price) {
  const now = new Date().toISOString();
  const path =
    "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,activo,categoria,fecha_inicio,fecha_fin" +
    "&activo=eq.true&categoria=eq.tienda&order=id.asc";

  const coupons = await supabase(path);

  return coupons
    .filter((coupon) => {
      if (coupon.fecha_inicio && new Date(coupon.fecha_inicio) > new Date(now)) return false;
      if (coupon.fecha_fin && new Date(coupon.fecha_fin) <= new Date(now)) return false;
      return true;
    })
    .map((coupon) => couponDiscount(coupon, price))
    .filter(Boolean)
    .sort((a, b) => b.descuento - a.descuento)[0] || null;
}

async function inspectProduct(link) {
  const original = String(link || "").trim();
  if (!original) throw new Error("Ingresa el enlace del producto.");

  let resolved = { finalUrl: original, html: "" };
  try {
    resolved = await resolveUrl(original);
  } catch {
    // Se continúa con el enlace original.
  }

  let itemId = extractItemId(original) || extractItemId(resolved.finalUrl) ||
    extractItemId(resolved.html);

  let item = itemId ? await getMercadoLibreItem(itemId) : null;

  const title = item?.title || metaContent(resolved.html, "og:title");
  const image =
    item?.pictures?.[0]?.secure_url ||
    item?.thumbnail ||
    metaContent(resolved.html, "og:image");
  const price =
    numberFromText(item?.price) ||
    numberFromText(metaContent(resolved.html, "product:price:amount")) ||
    numberFromText(metaContent(resolved.html, "og:price:amount"));

  if (!itemId && item?.id) itemId = item.id;

  if (!price) {
    throw new Error(
      "No se pudo obtener el precio. Revisa que sea una publicación pública de Mercado Libre."
    );
  }

  const coupon = await bestCoupon(price);

  return {
    plataforma: "mercadolibre",
    item_id: itemId || "",
    enlace_resuelto: resolved.finalUrl,
    titulo: title || "",
    imagen_url: image || "",
    precio_numero: price,
    precio_publicado: money(price),
    codigo_cupon: coupon?.codigo || "",
    precio_cupon: coupon ? money(coupon.precio_final) : "",
    descuento_estimado: coupon ? money(coupon.descuento) : "",
    cupon_titulo: coupon?.titulo || "",
    actualizado_en: new Date().toISOString(),
  };
}

export default async function handler(request, response) {
  if (!authorized(request)) {
    return response.status(401).json({ error: "Contraseña incorrecta." });
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  try {
    const data = await inspectProduct(request.body?.enlace);
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json(data);
  } catch (error) {
    return response.status(400).json({
      error: error.message || "No fue posible consultar el producto.",
    });
  }
}
