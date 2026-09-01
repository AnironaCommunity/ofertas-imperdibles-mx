/*
 * PAQUETE 7.5
 * Endpoint legado conservado únicamente para clientes que aún tengan en caché
 * una versión antigua del frontend. Ya NO incrementa ningún contador.
 *
 * El contador visible de cada cupón vuelve a representar USOS y solo se
 * incrementa mediante /api/clic al pulsar "Copiar código" o "Ver ofertas".
 */
export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY;
  const id = Number(request.body?.id);

  response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");

  if (!supabaseUrl || !secretKey) {
    // Importante: aunque falte configuración, nunca incrementamos una vista.
    return response.status(200).json({ visitas: null, clics: null, legacy: true });
  }

  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({ error: "Identificador de cupón no válido." });
  }

  try {
    // Solo consulta el valor actual. No ejecuta incrementar_clic_cupon.
    const resultado = await fetch(
      `${supabaseUrl}/rest/v1/cupones?select=clics&id=eq.${id}&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          Accept: "application/json",
        },
      }
    );

    if (!resultado.ok) {
      return response.status(200).json({ visitas: null, clics: null, legacy: true });
    }

    const filas = await resultado.json();
    const total = Number(filas?.[0]?.clics);
    const valor = Number.isFinite(total) ? total : null;

    // Se mantiene "visitas" solo para que clientes antiguos no fallen,
    // pero el valor devuelto es el contador actual de usos y NO se incrementa.
    return response.status(200).json({ visitas: valor, clics: valor, legacy: true });
  } catch (error) {
    console.warn("Endpoint legado cupon-visita sin incremento:", error);
    return response.status(200).json({ visitas: null, clics: null, legacy: true });
  }
}
