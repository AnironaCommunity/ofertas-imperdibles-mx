export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Método no permitido",
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
    const supabaseResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/incrementar_clic_cupon`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_id: id,
        }),
      }
    );

    if (!supabaseResponse.ok) {
      const detail = await supabaseResponse.text();

      console.error("Supabase respondió:", detail);

      return response.status(502).json({
        error: "No fue posible registrar el clic.",
      });
    }

    const total = await supabaseResponse.json();

    return response.status(200).json({
      clics: total,
    });
  } catch (error) {
    console.error("Error registrando clic:", error);

    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
