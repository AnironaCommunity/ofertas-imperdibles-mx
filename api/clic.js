export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      error: "Método no permitido.",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const id = Number(request.body?.id);

  if (!supabaseUrl || !secretKey) {
    return response.status(500).json({
      error: "Falta configurar Supabase en Vercel.",
    });
  }

  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({
      error: "Identificador de cupón no válido.",
    });
  }

  try {
    const resultado = await fetch(
      `${supabaseUrl}/rest/v1/rpc/incrementar_clic_cupon`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          p_id: id,
        }),
      }
    );

    if (!resultado.ok) {
      const detalle = await resultado.text();
      console.error("Error de Supabase:", detalle);

      return response.status(502).json({
        error: "No fue posible registrar el clic.",
      });
    }

    const total = await resultado.json();

    response.setHeader(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate"
    );

    return response.status(200).json({
      clics: Number(total),
    });
  } catch (error) {
    console.error("Error registrando clic:", error);

    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
