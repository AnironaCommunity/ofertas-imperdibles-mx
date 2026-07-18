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
      "id,titulo,descripcion,imagen_url,enlace,precio_publicado,precio_cupon,codigo_cupon,plataforma,categoria,secciones,orden,clics,visitas"
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

    const datos = JSON.parse(text);

    const normalizados = Array.isArray(datos)
      ? datos.map((item) => {
          let secciones = item?.secciones;

          if (!Array.isArray(secciones)) {
            if (typeof secciones === "string") {
              try {
                const parsed = JSON.parse(secciones);
                secciones = Array.isArray(parsed) ? parsed : [];
              } catch {
                secciones = secciones
                  .replace(/^\{|\}$/g, "")
                  .split(",")
                  .map((value) =>
                    value.trim().replace(/^"|"$/g, "")
                  )
                  .filter(Boolean);
              }
            } else {
              secciones = [];
            }
          }

          if (!secciones.length) {
            secciones = [item?.categoria || "ofertas_dia"];
          }

          const link = String(item?.enlace || "").toLowerCase();

          return {
            ...item,
            plataforma:
              item?.plataforma === "amazon" ||
              link.includes("amazon.") ||
              link.includes("a.co/")
                ? "amazon"
                : "mercadolibre",
            secciones,
          };
        })
      : [];

    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json(normalizados);
  } catch (error) {
    return response.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
