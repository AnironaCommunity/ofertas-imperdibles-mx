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

function readableSupabaseError(data, status) {
  if (!data) return `Supabase respondió con error ${status}.`;

  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (typeof data.details === "string") return data.details;
  if (typeof data.hint === "string") return data.hint;

  if (data.message && typeof data.message === "object") {
    return readableSupabaseError(data.message, status);
  }

  if (data.error && typeof data.error === "object") {
    return readableSupabaseError(data.error, status);
  }

  try {
    return JSON.stringify(data);
  } catch {
    return `Supabase respondió con error ${status}.`;
  }
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
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!result.ok) {
    throw new Error(readableSupabaseError(data, result.status));
  }

  return data;
}

function cleanColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

export default async function handler(request, response) {
  response.setHeader("X-Hero-Config-Version", "67.15.4");
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

      return response.status(200).json({
        ...(data?.[0] || payload),
        api_version: "67.15.4",
      });
    }

    return response.status(405).json({ error: "Método no permitido." });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : readableSupabaseError(error, 500);

    return response.status(500).json({
      error: typeof message === "string" ? message : JSON.stringify(message),
      api_version: "67.15.4",
    });
  }
}
