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
      error: "Falta configurar Supabase en Vercel.",
    });
  }

  try {
    const parametros = new URLSearchParams({
      select:
        "id,titulo,codigo,compra_minima,ahorro_maximo,enlace,clics",
      activo: "eq.true",
      order: "id.asc",
    });

    const resultado = await fetch(
      `${supabaseUrl}/rest/v1/cupones?${parametros.toString()}`,
      {
        headers: {
          apikey: secretKey,
          Accept: "application/json",
        },
      }
    );

    if (!resultado.ok) {
      const detalle = await resultado.text();
      console.error("Error de Supabase:", detalle);

      return response.status(502).json({
        error: "No fue posible consultar los cupones.",
      });
    }

    const cupones = await resultado.json();

    response.setHeader(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate"
    );

    return response.status(200).json(cupones);
  } catch (error) {
    console.error("Error consultando cupones:", error);

    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
