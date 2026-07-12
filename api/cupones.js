export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Método no permitido.",
    });
  }

  const secretKey = process.env.SUPABASE_SECRET_KEY;

  const supabaseUrl = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");

  if (!supabaseUrl || !secretKey) {
    return response.status(500).json({
      error: "Faltan las variables de Supabase.",
      urlConfigurada: Boolean(supabaseUrl),
      llaveConfigurada: Boolean(secretKey),
    });
  }

  try {
    const endpoint = new URL("/rest/v1/cupones", supabaseUrl);

    endpoint.searchParams.set(
      "select",
      "id,titulo,codigo,compra_minima,ahorro_maximo,enlace,clics,activo"
    );
    endpoint.searchParams.set("activo", "eq.true");
    endpoint.searchParams.set("order", "id.asc");

    const resultado = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        Accept: "application/json",
      },
    });

    if (!resultado.ok) {
      const detalle = await resultado.text();

      return response.status(502).json({
        error: "Supabase rechazó la consulta.",
        status: resultado.status,
        detalle,
        endpointUsado: endpoint.toString(),
      });
    }

    const cupones = await resultado.json();

    response.setHeader("Cache-Control", "no-store");

    return response.status(200).json(cupones);
  } catch (error) {
    return response.status(500).json({
      error: "Error interno del servidor.",
      detalle: error.message,
      urlBaseDetectada: supabaseUrl,
    });
  }
}
