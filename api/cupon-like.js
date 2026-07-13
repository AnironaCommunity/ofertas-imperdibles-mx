export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const id = Number(request.body?.id);
  const accion = request.body?.accion === "quitar" ? "quitar" : "agregar";

  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({ error: "ID no válido." });
  }

  const url = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");

  const key = process.env.SUPABASE_SECRET_KEY;

  try {
    const functionName =
      accion === "quitar"
        ? "quitar_like_cupon"
        : "agregar_like_cupon";

    const result = await fetch(
      `${url}/rest/v1/rpc/${functionName}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_id: id }),
      }
    );

    const text = await result.text();

    if (!result.ok) {
      return response.status(502).json({
        error: "No fue posible registrar el Me gusta.",
        detalle: text,
      });
    }

    return response.status(200).json({
      likes: Number(JSON.parse(text)),
    });
  } catch (error) {
    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
