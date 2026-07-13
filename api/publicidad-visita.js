export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const id = Number(request.body?.id);
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
    const result = await fetch(`${url}/rest/v1/rpc/incrementar_visita_publicidad`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_id: id }),
    });

    if (!result.ok) {
      return response.status(502).json({ error: "No fue posible registrar la visita." });
    }

    return response.status(200).json({ visitas: Number(await result.json()) });
  } catch (error) {
    return response.status(500).json({ error: "Error interno del servidor." });
  }
}
