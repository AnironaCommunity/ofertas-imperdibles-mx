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

export default async function handler(request, response) {
  if (!authorized(request)) {
    return response.status(401).json({
      error: "Contraseña de administrador incorrecta.",
    });
  }

  try {
    if (request.method === "GET") {
      const data = await requestSupabase(
        "publicidades?select=id,titulo,descripcion,imagen_url,enlace,precio_publicado,precio_cupon,codigo_cupon,categoria,activo,orden,clics,fecha_creacion&order=orden.asc,id.asc"
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
        categoria: ["ofertas_dia", "comunidad_anirona", "ofertas_amazon"].includes(request.body?.categoria)
          ? request.body.categoria
          : "ofertas_dia",
        activo: request.body?.activo !== false,
        orden: Math.max(0, Number(request.body?.orden) || 0),
        clics: 0,
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
        "activo",
        "orden",
      ]) {
        if (!Object.hasOwn(request.body || {}, field)) continue;

        if (field === "activo") {
          payload[field] = Boolean(request.body[field]);
        } else if (field === "categoria") {
          payload[field] = ["ofertas_dia", "comunidad_anirona", "ofertas_amazon"].includes(request.body[field])
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
