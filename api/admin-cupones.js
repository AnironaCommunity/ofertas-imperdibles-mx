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
    key:
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

async function requestSupabase(path, options = {}) {
  const { url, key } = supabaseConfig();

  if (!url || !key) {
    throw new Error("Faltan variables de conexión con Supabase.");
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

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeCategory(value) {
  return value === "bancarios" ? "bancarios" : "tienda";
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
        "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,categoria,enlace,activo,likes,clics,fecha_inicio,fecha_fin,fecha_creacion,fecha_publicacion&order=id.desc"
      );

      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json(data);
    }

    if (request.method === "POST") {
      const publicarComoNuevo =
        request.body?.publicar_como_nuevo !== false;

      const payload = {
        titulo: cleanText(request.body?.titulo),
        codigo: cleanText(request.body?.codigo),
        compra_minima: cleanText(request.body?.compra_minima),
        ahorro_maximo: cleanText(request.body?.ahorro_maximo),
        categoria: normalizeCategory(request.body?.categoria),
        enlace: cleanText(request.body?.enlace),
        activo: request.body?.activo !== false,
        fecha_inicio: request.body?.fecha_inicio || null,
        fecha_fin: request.body?.fecha_fin || null,
        fecha_publicacion: publicarComoNuevo
          ? new Date().toISOString()
          : null,
      };

      if (!payload.titulo || !payload.codigo || !payload.enlace) {
        return response.status(400).json({
          error: "Título, código y enlace son obligatorios.",
        });
      }

      const data = await requestSupabase("cupones", {
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
          error: "ID de cupón no válido.",
        });
      }

      const payload = {};

      for (const field of [
        "titulo",
        "codigo",
        "compra_minima",
        "ahorro_maximo",
        "enlace",
      ]) {
        if (Object.hasOwn(request.body || {}, field)) {
          payload[field] = cleanText(request.body[field]);
        }
      }

      if (Object.hasOwn(request.body || {}, "categoria")) {
        payload.categoria = normalizeCategory(request.body.categoria);
      }

      if (Object.hasOwn(request.body || {}, "activo")) {
        payload.activo = Boolean(request.body.activo);
      }

      if (Object.hasOwn(request.body || {}, "fecha_inicio")) {
        payload.fecha_inicio = request.body.fecha_inicio || null;
      }

      if (Object.hasOwn(request.body || {}, "fecha_fin")) {
        payload.fecha_fin = request.body.fecha_fin || null;
      }

      if (request.body?.publicar_como_nuevo === true) {
        payload.fecha_publicacion = new Date().toISOString();
      }

      const data = await requestSupabase(`cupones?id=eq.${id}`, {
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
          error: "ID de cupón no válido.",
        });
      }

      await requestSupabase(`cupones?id=eq.${id}`, {
        method: "DELETE",
      });

      return response.status(200).json({ ok: true });
    }

    response.setHeader("Allow", "GET, POST, PUT, DELETE");
    return response.status(405).json({
      error: "Método no permitido.",
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Error interno del servidor.",
    });
  }
}
