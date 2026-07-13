
function authorized(request) {
  const adminOk = Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") === process.env.ADMIN_PASSWORD;
  const cronOk = Boolean(process.env.CRON_SECRET) &&
    String(request.headers.authorization || "") === `Bearer ${process.env.CRON_SECRET}`;
  return adminOk || cronOk;
}

function config() {
  return {
    url: String(process.env.SUPABASE_URL || "").trim()
      .replace(/^["']|["']$/g, "").replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, ""),
    key: process.env.SUPABASE_SECRET_KEY,
  };
}

async function db(path, options = {}) {
  const { url, key } = config();
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
  if (!result.ok) throw new Error(data?.message || "Error de Supabase.");
  return data;
}

async function inspect(enlace, adminPassword) {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : String(process.env.PUBLIC_SITE_URL || "https://ofertasimperdiblesmx.vercel.app");

  const response = await fetch(`${base}/api/admin-producto-mercadolibre`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword || process.env.ADMIN_PASSWORD || "",
    },
    body: JSON.stringify({ enlace }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo consultar.");
  return data;
}

export default async function handler(request, response) {
  if (!authorized(request)) {
    return response.status(401).json({ error: "No autorizado." });
  }

  if (!["POST", "GET"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  try {
    const products = await db(
      "publicidades?select=id,enlace,actualizar_precio_auto&actualizar_precio_auto=eq.true&activo=eq.true&order=id.asc"
    );

    const results = [];

    for (const product of products) {
      try {
        const info = await inspect(
          product.enlace,
          String(request.headers["x-admin-password"] || "")
        );

        const payload = {
          ml_item_id: info.item_id || null,
          precio_publicado: info.precio_publicado,
          precio_cupon: info.precio_cupon,
          codigo_cupon: info.codigo_cupon,
          precio_actualizado_en: info.actualizado_en,
        };

        await db(`publicidades?id=eq.${product.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(payload),
        });

        results.push({ id: product.id, ok: true, precio: info.precio_publicado });
      } catch (error) {
        results.push({ id: product.id, ok: false, error: error.message });
      }
    }

    return response.status(200).json({
      procesados: results.length,
      correctos: results.filter((item) => item.ok).length,
      errores: results.filter((item) => !item.ok).length,
      resultados: results,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
