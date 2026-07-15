function supabaseConfig() {
  return {
    url: String(process.env.SUPABASE_URL || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/, ""),
    key:
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY,
  };
}

async function requestSupabase(path) {
  const { url, key } = supabaseConfig();

  if (!url || !key) {
    throw new Error("Faltan variables de conexión con Supabase.");
  }

  const result = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  const text = await result.text();
  const data = text ? JSON.parse(text) : null;

  if (!result.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "No fue posible consultar los cupones."
    );
  }

  return data;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({
      error: "Método no permitido.",
    });
  }

  try {
    if (request.query?.action === "hero-config") {
      const config = await requestSupabase(
        "configuracion_web?select=imagen_url,color_inicio,color_fin&id=eq.hero_redes&limit=1"
      );

      response.setHeader("Cache-Control", "no-store");

      return response.status(200).json(
        config?.[0] || {
          imagen_url: "",
          color_inicio: "#e9cdff",
          color_fin: "#fae8fa",
        }
      );
    }

    const data = await requestSupabase(
      "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,categoria,enlace,activo,likes,clics,fecha_inicio,fecha_fin,fecha_creacion,fecha_publicacion,imagen_url&order=id.desc"
    );

    response.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=15, stale-while-revalidate=30"
    );

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Error interno del servidor.",
    });
  }
}
