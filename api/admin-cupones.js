function isAuthorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") ===
      process.env.ADMIN_PASSWORD;
}

function config() {
  return {
    url: String(process.env.SUPABASE_URL || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/, ""),
    key: process.env.SUPABASE_SECRET_KEY,
  };
}

async function supabaseFetch(path, options = {}) {
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

  if (!result.ok) {
    throw new Error("Supabase no pudo completar la operación.");
  }

  return data;
}

function cleanTimestamp(value) {
  const text = String(value || "").trim();
  return text || null;
}

export default async function handler(request, response) {
  if (!isAuthorized(request)) {
    return response.status(401).json({
      error: "Contraseña de administrador incorrecta.",
    });
  }

  try {
    if (request.method === "GET") {
      const data = await supabaseFetch(
        "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,enlace,clics,likes,activo,categoria,fecha_inicio,fecha_fin&order=id.desc"
      );

      return response.status(200).json(data);
    }

    if (request.method === "POST") {
      const payload = {
        titulo: String(request.body?.titulo || "").trim(),
        codigo: String(request.body?.codigo || "").trim(),
        compra_minima: String(request.body?.compra_minima || "").trim(),
        ahorro_maximo: String(request.body?.ahorro_maximo || "").trim(),
        enlace: String(request.body?.enlace || "").trim(),
        categoria:
          request.body?.categoria === "bancarios"
            ? "bancarios"
            : "tienda",
        fecha_inicio: cleanTimestamp(request.body?.fecha_inicio),
        fecha_fin: cleanTimestamp(request.body?.fecha_fin),
        activo: request.body?.activo !== false,
        clics: 0,
        likes: 0,
      };

      if (!payload.titulo || !payload.codigo || !payload.enlace) {
        return response.status(400).json({
          error: "Título, código y enlace son obligatorios.",
        });
      }

      if (
        payload.fecha_inicio &&
        payload.fecha_fin &&
        new Date(payload.fecha_fin) <= new Date(payload.fecha_inicio)
      ) {
        return response.status(400).json({
          error: "La fecha final debe ser posterior a la fecha inicial.",
        });
      }

      const data = await supabaseFetch("cupones", {
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
      const payload = {};

      for (const field of [
        "titulo",
        "codigo",
        "compra_minima",
        "ahorro_maximo",
        "enlace",
        "activo",
        "categoria",
        "fecha_inicio",
        "fecha_fin",
      ]) {
        if (!Object.hasOwn(request.body || {}, field)) continue;

        if (field === "activo") {
          payload[field] = Boolean(request.body[field]);
        } else if (field === "categoria") {
          payload[field] =
            request.body[field] === "bancarios"
              ? "bancarios"
              : "tienda";
        } else if (field === "fecha_inicio" || field === "fecha_fin") {
          payload[field] = cleanTimestamp(request.body[field]);
        } else {
          payload[field] = String(request.body[field] || "").trim();
        }
      }

      if (
        payload.fecha_inicio &&
        payload.fecha_fin &&
        new Date(payload.fecha_fin) <= new Date(payload.fecha_inicio)
      ) {
        return response.status(400).json({
          error: "La fecha final debe ser posterior a la fecha inicial.",
        });
      }

      const data = await supabaseFetch(`cupones?id=eq.${id}`, {
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

      await supabaseFetch(`cupones?id=eq.${id}`, {
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
