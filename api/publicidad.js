export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const url = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");

  const key = process.env.SUPABASE_SECRET_KEY;

  try {
    const endpoint = new URL("/rest/v1/publicidades", url);

    endpoint.searchParams.set(
      "select",
      "id,titulo,descripcion,imagen_url,enlace,orden,clics"
    );
    endpoint.searchParams.set("activo", "eq.true");
    endpoint.searchParams.set("order", "orden.asc,id.asc");

    const result = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });

    const text = await result.text();

    if (!result.ok) {
      return response.status(502).json({
        error: "No fue posible consultar la publicidad.",
        detalle: text,
      });
    }

    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json(JSON.parse(text));
  } catch (error) {
    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
