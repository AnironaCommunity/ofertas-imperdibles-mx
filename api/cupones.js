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
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : typeof data?.details === "string"
            ? data.details
            : "No fue posible completar la operación.";

    throw new Error(message);
  }

  return data;
}

async function obtenerVisitantes() {
  const rows = await requestSupabase(
    "site_stats?select=total_visitas&id=eq.principal&limit=1"
  );

  return Number(rows?.[0]?.total_visitas || 0);
}

async function registrarVisitante() {
  const data = await requestSupabase("rpc/registrar_visita_sitio", {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (typeof data === "number") {
    return data;
  }

  if (Array.isArray(data)) {
    const first = data[0];

    if (typeof first === "number") {
      return first;
    }

    if (first && typeof first.total_visitas !== "undefined") {
      return Number(first.total_visitas || 0);
    }

    if (first && typeof first.registrar_visita_sitio !== "undefined") {
      return Number(first.registrar_visita_sitio || 0);
    }
  }

  return obtenerVisitantes();
}

export default async function handler(request, response) {
  const action = String(request.query?.action || "").trim();

  /*
   * Contador de visitantes.
   * GET: consulta el total.
   * POST: incrementa y devuelve el nuevo total.
   */
  if (action === "visitantes") {
    if (!["GET", "POST"].includes(request.method)) {
      response.setHeader("Allow", "GET, POST");
      return response.status(405).json({
        error: "Método no permitido.",
      });
    }

    try {
      const total =
        request.method === "POST"
          ? await registrarVisitante()
          : await obtenerVisitantes();

      response.setHeader("Cache-Control", "no-store");

      return response.status(200).json({
        total_visitas: total,
      });
    } catch (error) {
      return response.status(500).json({
        error: error.message || "No se pudo cargar el contador de visitantes.",
      });
    }
  }

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({
      error: "Método no permitido.",
    });
  }

  try {
    if (action === "hero-config") {
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
