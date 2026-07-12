export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Método no permitido.",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    return response.status(500).json({
      error: "Faltan las variables de Supabase en Vercel.",
      urlConfigurada: Boolean(supabaseUrl),
      llaveConfigurada: Boolean(secretKey),
    });
  }

  try {
    const parametros = new URLSearchParams({
      select:
        "id,titulo,codigo,compra_minima,ahorro_maximo,enlace,clics,activo",
      activo: "eq.true",
      order: "id.asc",
    });

    const resultado = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/cupones?${parametros}`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!resultado.ok) {
      const detalle = await resultado.text();

      console.error("Respuesta de Supabase:", detalle);

      return response.status(502).json({
        error: "Supabase rechazó la consulta.",
        status: resultado.status,
        detalle,
      });
    }

    const cupones = await resultado.json();

    response.setHeader("Cache-Control", "no-store");

    return response.status(200).json(cupones);
  } catch (error) {
    console.error("Error consultando cupones:", error);

    return response.status(500).json({
      error: "Error interno del servidor.",
      detalle: error.message,
    });
  }
}
