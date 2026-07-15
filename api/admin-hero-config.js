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
    key:
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

async function requestSupabase(path, options = {}) {
  const { url, key } = supabaseConfig();
  if (!url || !key) throw new Error("Faltan variables de conexión con Supabase.");

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
    throw new Error(data?.message || data?.error || "No se pudo completar la operación.");
  }

  return data;
}

function cleanColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

export default async function handler(request, response) {
  if (!authorized(request)) {
    return response.status(401).json({ error: "Contraseña de administrador incorrecta." });
  }

  try {
    if (request.method === "GET") {
      const data = await requestSupabase(
        "configuracion_web?select=imagen_url,color_inicio,color_fin&id=eq.hero_redes&limit=1"
      );

      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json(
        data?.[0] || {
          imagen_url: "",
          color_inicio: "#e9cdff",
          color_fin: "#fae8fa",
        }
      );
    }

    if (request.method === "PUT") {
      const payload = {
        id: "hero_redes",
        imagen_url: String(request.body?.imagen_url || "").trim(),
        color_inicio: cleanColor(request.body?.color_inicio, "#e9cdff"),
        color_fin: cleanColor(request.body?.color_fin, "#fae8fa"),
        actualizado_en: new Date().toISOString(),
      };

      const data = await requestSupabase(
        "configuracion_web?on_conflict=id",
        {
          method: "POST",
          headers: {
            Prefer: "resolution=merge-duplicates,return=representation",
          },
          body: JSON.stringify(payload),
        }
      );

      return response.status(200).json(data?.[0] || payload);
    }

    return response.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
