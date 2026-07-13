const ALLOWED_SECTIONS = [
  "ofertas_dia",
  "ofertas_mercado_libre",
  "ofertas_amazon",
  "comunidad_anirona",
];

function normalizeSections(value, fallback = ["ofertas_dia"]) {
  const values = Array.isArray(value) ? value : [];
  const unique = [...new Set(
    values.filter((item) => ALLOWED_SECTIONS.includes(item))
  )];
  return unique.length ? unique : fallback;
}

function adminAuthorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") ===
      process.env.ADMIN_PASSWORD;
}

function cronAuthorized(request) {
  return Boolean(process.env.CRON_SECRET) &&
    String(request.headers.authorization || "") ===
      `Bearer ${process.env.CRON_SECRET}`;
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

async function requestSupabase(path, options = {}) {
  const { url, key } = supabaseConfig();

  if (!url || !key) {
    throw new Error("Faltan variables de Supabase.");
  }

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
    throw new Error(
      data?.message ||
      data?.error ||
      "Supabase no pudo completar la operación."
    );
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
    new RegExp(
      `<meta[^>]+property=["']${safe}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${safe}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${safe}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
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

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.mercadolibre.com/items/${itemId}`,
    { headers }
  );

  if (!response.ok) return null;
  return response.json();
}

function couponDiscount(coupon, price) {
  const minimum = numberFromText(coupon.compra_minima);

  if (!coupon.activo || price < minimum) {
    return null;
  }

  const title = String(coupon.titulo || "").toUpperCase();
  const maximum = numberFromText(coupon.ahorro_maximo);
  const percent = title.match(/(\d+(?:\.\d+)?)\s*%/);
  const fixed = title.match(
    /\$?\s*([\d,]+(?:\.\d+)?)\s*(?:OFF|DE DESCUENTO)/
  );

  let discount = 0;

  if (percent) {
    discount = price * (Number(percent[1]) / 100);

    if (maximum > 0) {
      discount = Math.min(discount, maximum);
    }
  } else if (fixed) {
    discount = numberFromText(fixed[1]);
  } else if (maximum > 0) {
    discount = maximum;
  }

  discount = Math.max(0, Math.min(discount, price));

  if (discount <= 0) {
    return null;
  }

  return {
    codigo: String(coupon.codigo || "").trim(),
    descuento: discount,
    precio_final: price - discount,
    compra_minima: minimum,
    titulo: coupon.titulo,
  };
}

async function bestCoupon(price) {
  const now = new Date();

  const coupons = await requestSupabase(
    "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,activo,categoria,fecha_inicio,fecha_fin" +
    "&activo=eq.true&categoria=eq.tienda&order=id.asc"
  );

  return coupons
    .filter((coupon) => {
      if (
        coupon.fecha_inicio &&
        new Date(coupon.fecha_inicio) > now
      ) {
        return false;
      }

      if (
        coupon.fecha_fin &&
        new Date(coupon.fecha_fin) <= now
      ) {
        return false;
      }

      return true;
    })
    .map((coupon) => couponDiscount(coupon, price))
    .filter(Boolean)
    .sort((a, b) => b.descuento - a.descuento)[0] || null;
}

async function inspectProduct(link) {
  const original = String(link || "").trim();

  if (!original) {
    throw new Error("Ingresa el enlace del producto.");
  }

  let resolved = {
    finalUrl: original,
    html: "",
  };

  try {
    resolved = await resolveUrl(original);
  } catch {
    // Se continúa con el enlace original.
  }

  let itemId =
    extractItemId(original) ||
    extractItemId(resolved.finalUrl) ||
    extractItemId(resolved.html);

  const item = itemId
    ? await getMercadoLibreItem(itemId)
    : null;

  const title =
    item?.title ||
    metaContent(resolved.html, "og:title");

  const image =
    item?.pictures?.[0]?.secure_url ||
    item?.thumbnail ||
    metaContent(resolved.html, "og:image");

  const price =
    numberFromText(item?.price) ||
    numberFromText(
      metaContent(resolved.html, "product:price:amount")
    ) ||
    numberFromText(
      metaContent(resolved.html, "og:price:amount")
    );

  if (!itemId && item?.id) {
    itemId = item.id;
  }

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
    precio_cupon: coupon
      ? money(coupon.precio_final)
      : "",
    descuento_estimado: coupon
      ? money(coupon.descuento)
      : "",
    cupon_titulo: coupon?.titulo || "",
    actualizado_en: new Date().toISOString(),
  };
}

async function updateAutomaticPrices() {
  const products = await requestSupabase(
    "publicidades?select=id,enlace,actualizar_precio_auto" +
    "&actualizar_precio_auto=eq.true&activo=eq.true&order=id.asc"
  );

  const results = [];

  for (const product of products) {
    try {
      const info = await inspectProduct(product.enlace);

      const payload = {
        ml_item_id: info.item_id || null,
        precio_publicado: info.precio_publicado,
        precio_cupon: info.precio_cupon,
        codigo_cupon: info.codigo_cupon,
        precio_actualizado_en: info.actualizado_en,
      };

      await requestSupabase(
        `publicidades?id=eq.${product.id}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=minimal",
          },
          body: JSON.stringify(payload),
        }
      );

      results.push({
        id: product.id,
        ok: true,
        precio: info.precio_publicado,
      });
    } catch (error) {
      results.push({
        id: product.id,
        ok: false,
        error: error.message,
      });
    }
  }

  return {
    procesados: results.length,
    correctos: results.filter((item) => item.ok).length,
    errores: results.filter((item) => !item.ok).length,
    resultados: results,
  };
}

export default async function handler(request, response) {
  const action = String(request.query?.action || "").trim();

  const isCronAction =
    action === "actualizar-precios" &&
    request.method === "GET";

  if (
    !(adminAuthorized(request) ||
      (isCronAction && cronAuthorized(request)))
  ) {
    return response.status(401).json({
      error: "No autorizado.",
    });
  }

  try {
    if (
      action === "consultar-producto" &&
      request.method === "POST"
    ) {
      const data = await inspectProduct(
        request.body?.enlace
      );

      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json(data);
    }

    if (
      action === "actualizar-precios" &&
      ["GET", "POST"].includes(request.method)
    ) {
      const data = await updateAutomaticPrices();

      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json(data);
    }

    if (request.method === "GET") {
      const data = await requestSupabase(
        "publicidades?select=id,titulo,descripcion,imagen_url,enlace,precio_publicado,precio_cupon,codigo_cupon,categoria,secciones,ml_item_id,actualizar_precio_auto,precio_actualizado_en,activo,orden,clics,visitas,fecha_creacion&order=orden.asc,id.asc"
      );

      return response.status(200).json(data);
    }

    if (request.method === "POST") {
      const sections = normalizeSections(
        request.body?.secciones
      );

      const payload = {
        titulo: String(
          request.body?.titulo || ""
        ).trim(),
        descripcion: String(
          request.body?.descripcion || ""
        ).trim(),
        imagen_url: String(
          request.body?.imagen_url || ""
        ).trim(),
        enlace: String(
          request.body?.enlace || ""
        ).trim(),
        precio_publicado: String(
          request.body?.precio_publicado || ""
        ).trim(),
        precio_cupon: String(
          request.body?.precio_cupon || ""
        ).trim(),
        codigo_cupon: String(
          request.body?.codigo_cupon || ""
        ).trim(),
        ml_item_id:
          String(
            request.body?.ml_item_id || ""
          ).trim() || null,
        actualizar_precio_auto: Boolean(
          request.body?.actualizar_precio_auto
        ),
        precio_actualizado_en:
          request.body?.precio_actualizado_en ||
          null,
        secciones: sections,
        categoria:
          sections[0] ||
          (ALLOWED_SECTIONS.includes(
            request.body?.categoria
          )
            ? request.body.categoria
            : "ofertas_dia"),
        activo:
          request.body?.activo !== false,
        orden: Math.max(
          0,
          Number(request.body?.orden) || 0
        ),
        clics: 0,
        visitas: 0,
      };

      if (
        !payload.titulo ||
        !payload.imagen_url ||
        !payload.enlace
      ) {
        return response.status(400).json({
          error:
            "Título, imagen y enlace son obligatorios.",
        });
      }

      const data = await requestSupabase(
        "publicidades",
        {
          method: "POST",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload),
        }
      );

      return response
        .status(201)
        .json(data?.[0] || data);
    }

    if (request.method === "PUT") {
      const id = Number(request.body?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          error: "ID no válido.",
        });
      }

      const payload = {};

      for (const field of [
        "titulo",
        "descripcion",
        "imagen_url",
        "enlace",
        "precio_publicado",
        "precio_cupon",
        "codigo_cupon",
        "ml_item_id",
        "actualizar_precio_auto",
        "precio_actualizado_en",
        "categoria",
        "secciones",
        "activo",
        "orden",
      ]) {
        if (
          !Object.hasOwn(
            request.body || {},
            field
          )
        ) {
          continue;
        }

        if (
          field === "activo" ||
          field === "actualizar_precio_auto"
        ) {
          payload[field] = Boolean(
            request.body[field]
          );
        } else if (field === "secciones") {
          payload.secciones =
            normalizeSections(
              request.body.secciones
            );
          payload.categoria =
            payload.secciones[0];
        } else if (field === "categoria") {
          payload[field] =
            ALLOWED_SECTIONS.includes(
              request.body[field]
            )
              ? request.body[field]
              : "ofertas_dia";
        } else if (field === "orden") {
          payload[field] = Math.max(
            0,
            Number(request.body[field]) || 0
          );
        } else if (
          field === "precio_actualizado_en"
        ) {
          payload[field] =
            request.body[field] || null;
        } else if (field === "ml_item_id") {
          payload[field] =
            String(
              request.body[field] || ""
            ).trim() || null;
        } else {
          payload[field] = String(
            request.body[field] || ""
          ).trim();
        }
      }

      const data = await requestSupabase(
        `publicidades?id=eq.${id}`,
        {
          method: "PATCH",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload),
        }
      );

      return response
        .status(200)
        .json(data?.[0] || data);
    }

    if (request.method === "DELETE") {
      const id = Number(request.query?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          error: "ID no válido.",
        });
      }

      await requestSupabase(
        `publicidades?id=eq.${id}`,
        {
          method: "DELETE",
        }
      );

      return response
        .status(200)
        .json({ ok: true });
    }

    response.setHeader(
      "Allow",
      "GET, POST, PUT, DELETE"
    );

    return response.status(405).json({
      error: "Método no permitido.",
    });
  } catch (error) {
    return response.status(500).json({
      error:
        error.message ||
        "Error interno del servidor.",
    });
  }
}
