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

  if (!url || !key) {
    return response.status(500).json({
      error: "Faltan las variables de Supabase.",
    });
  }

  try {
    const endpoint = new URL("/rest/v1/cupones", url);

    endpoint.searchParams.set(
      "select",
      "id,titulo,codigo,compra_minima,ahorro_maximo,enlace,clics,likes,activo,categoria,fecha_inicio,fecha_fin"
    );
    endpoint.searchParams.set("activo", "eq.true");
    endpoint.searchParams.set("order", "id.asc");

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
        error: "Supabase rechazó la consulta.",
        detalle: text,
      });
    }

    const now = Date.now();
    const previewLimit = now + 24 * 60 * 60 * 1000;
    const rows = JSON.parse(text);

    /*
      Se muestran:
      - cupones activos actualmente;
      - cupones programados que comienzan durante las próximas 24 horas.
      Los finalizados se excluyen automáticamente.
    */
    const coupons = rows.filter((coupon) => {
      const start = coupon.fecha_inicio
        ? new Date(coupon.fecha_inicio).getTime()
        : null;

      const end = coupon.fecha_fin
        ? new Date(coupon.fecha_fin).getTime()
        : null;

      if (end !== null && end <= now) {
        return false;
      }

      if (start !== null && start > previewLimit) {
        return false;
      }

      return true;
    });

    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json(coupons);
  } catch (error) {
    return response.status(500).json({
      error: "Error interno del servidor.",
      detalle: error.message,
    });
  }
}
