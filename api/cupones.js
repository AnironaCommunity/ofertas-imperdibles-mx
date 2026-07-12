export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Método no permitido",
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
    const endpoint =
      `${supabaseUrl}/rest/v1/cupones` +
      "?select=id,titulo,codigo,compra_minima,ahorro_maximo,enlace,clics" +
      "&activo=eq.true" +
      "&order=id.asc";

    const supabaseResponse = await fetch(endpoint, {
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (!supabaseResponse.ok) {
      const detail = await supabaseResponse.text();

      console.error("Supabase respondió:", detail);

      return response.status(502).json({
        error: "No fue posible consultar los cupones.",
      });
    }

    const cupones = await supabaseResponse.json();

    return response.status(200).json(cupones);
  } catch (error) {
    console.error("Error consultando cupones:", error);

    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
