const ALLOWED_SECTIONS = [
  "ofertas_dia",
  "ofertas_mercado_libre",
  "ofertas_amazon",
  "comunidad_anirona",
];

function normalizeSections(value, fallback = ["ofertas_dia"]) {
  const values = Array.isArray(value) ? value : [];
  const unique = [...new Set(values.filter((item) => ALLOWED_SECTIONS.includes(item)))];
  return unique.length ? unique : fallback;
}

function authorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") ===
      process.env.ADMIN_PASSWORD;
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
    throw new Error("Supabase no pudo completar la operación.");
  }

  return data;
}


function normalizarItemId(valor) {
  const texto = String(valor || "").toUpperCase();

  const coincidencia = texto.match(/\bMLM[-_]?(\d{6,})\b/);
  return coincidencia ? `MLM${coincidencia[1]}` : "";
}

async function resolverEnlaceMercadoLibre(enlace) {
  const original = String(enlace || "").trim();

  if (!original) {
    throw new Error("El producto no tiene enlace.");
  }

  const itemDirecto = normalizarItemId(original);

  if (itemDirecto) {
    return {
      itemId: itemDirecto,
      enlaceFinal: original,
    };
  }

  let url;

  try {
    url = new URL(original);
  } catch {
    throw new Error("El enlace del producto no es válido.");
  }

  if (!/(^|\.)meli\.la$/i.test(url.hostname)) {
    throw new Error(
      "No se encontró el identificador MLM dentro del enlace del producto."
    );
  }

  const respuesta = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OfertasImperdiblesMX/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  const enlaceFinal = respuesta.url || original;
  const itemId = normalizarItemId(enlaceFinal);

  if (!itemId) {
    throw new Error(
      "El enlace corto abrió correctamente, pero no fue posible identificar el producto MLM."
    );
  }

  return {
    itemId,
    enlaceFinal,
  };
}

async function consultarItemMercadoLibre(itemId) {
  const headers = {
    Accept: "application/json",
  };

  const accessToken = String(
    process.env.MERCADOLIBRE_ACCESS_TOKEN || ""
  ).trim();

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const respuesta = await fetch(
    `https://api.mercadolibre.com/items/${encodeURIComponent(itemId)}`,
    { headers }
  );

  const texto = await respuesta.text();

  let datos = null;

  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error(
        "Mercado Libre rechazó la consulta. La publicación puede requerir un token de acceso válido."
      );
    }

    if (respuesta.status === 404) {
      throw new Error(
        "Mercado Libre no encontró la publicación o dejó de estar disponible."
      );
    }

    throw new Error(
      datos?.message ||
      datos?.error ||
      `Mercado Libre respondió con el estado ${respuesta.status}.`
    );
  }

  const precio = Number(datos?.price);

  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error(
      "Mercado Libre respondió, pero no proporcionó un precio válido."
    );
  }

  return {
    itemId: datos?.id || itemId,
    titulo: datos?.title || "",
    precio,
    enlace: datos?.permalink || "",
    estado: datos?.status || "",
  };
}

export default async function handler(request, response) {
  if (!authorized(request)) {
    return response.status(401).json({
      error: "Contraseña de administrador incorrecta.",
    });
  }

  try {
    const action = String(request.query?.action || "").trim();

    if (
      action === "consultar-precio-mercado-libre" &&
      request.method === "POST"
    ) {
      const resuelto = await resolverEnlaceMercadoLibre(
        request.body?.enlace
      );

      const item = await consultarItemMercadoLibre(
        resuelto.itemId
      );

      response.setHeader("Cache-Control", "no-store");

      return response.status(200).json({
        item_id: item.itemId,
        titulo: item.titulo,
        precio: item.precio,
        enlace: item.enlace || resuelto.enlaceFinal,
        estado: item.estado,
      });
    }

    if (request.method === "GET") {
      const data = await requestSupabase(
        "publicidades?select=id,titulo,descripcion,imagen_url,enlace,precio_publicado,precio_cupon,codigo_cupon,categoria,secciones,activo,orden,clics,visitas,fecha_creacion&order=orden.asc,id.asc"
      );

      return response.status(200).json(data);
    }

    if (request.method === "POST") {
      const payload = {
        titulo: String(request.body?.titulo || "").trim(),
        descripcion: String(request.body?.descripcion || "").trim(),
        imagen_url: String(request.body?.imagen_url || "").trim(),
        enlace: String(request.body?.enlace || "").trim(),
        precio_publicado: String(request.body?.precio_publicado || "").trim(),
        precio_cupon: String(request.body?.precio_cupon || "").trim(),
        codigo_cupon: String(request.body?.codigo_cupon || "").trim(),
        secciones: normalizeSections(request.body?.secciones),
        categoria: normalizeSections(request.body?.secciones)[0] ||
          (ALLOWED_SECTIONS.includes(request.body?.categoria)
            ? request.body.categoria
            : "ofertas_dia"),
        activo: request.body?.activo !== false,
        orden: Math.max(0, Number(request.body?.orden) || 0),
        clics: 0,
        visitas: 0,
      };

      if (!payload.titulo || !payload.imagen_url || !payload.enlace) {
        return response.status(400).json({
          error: "Título, imagen y enlace son obligatorios.",
        });
      }

      const data = await requestSupabase("publicidades", {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      return response.status(201).json(data?.[0] || data);
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
        "categoria",
        "secciones",
        "activo",
        "orden",
      ]) {
        if (!Object.hasOwn(request.body || {}, field)) continue;

        if (field === "activo") {
          payload[field] = Boolean(request.body[field]);
        } else if (field === "secciones") {
          payload.secciones = normalizeSections(request.body.secciones);
          payload.categoria = payload.secciones[0];
        } else if (field === "categoria") {
          payload[field] = ALLOWED_SECTIONS.includes(request.body[field])
            ? request.body[field]
            : "ofertas_dia";
        } else if (field === "orden") {
          payload[field] = Math.max(0, Number(request.body[field]) || 0);
        } else {
          payload[field] = String(request.body[field] || "").trim();
        }
      }

      const data = await requestSupabase(`publicidades?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      return response.status(200).json(data?.[0] || data);
    }

    if (request.method === "DELETE") {
      const id = Number(request.query?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          error: "ID no válido.",
        });
      }

      await requestSupabase(`publicidades?id=eq.${id}`, {
        method: "DELETE",
      });

      return response.status(200).json({ ok: true });
    }

    response.setHeader("Allow", "GET, POST, PUT, DELETE");
    return response.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Error interno del servidor.",
    });
  }
}
