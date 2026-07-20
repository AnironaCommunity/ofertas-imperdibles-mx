function supabaseConfig() {
  return {
    url: String(process.env.SUPABASE_URL || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/, ""),
    key:
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY,
  };
}

async function requestSupabase(path, options = {}) {
  const { url, key } = supabaseConfig();

  if (!url || !key) {
    throw new Error("Faltan variables de conexión con Supabase.");
  }

  const result = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await result.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!result.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : typeof data?.details === "string"
            ? data.details
            : "No fue posible completar la operación.";

    throw new Error(message);
  }

  return data;
}

async function obtenerVisitantes() {
  const rows = await requestSupabase(
    "site_stats?select=total_visitas&id=eq.principal&limit=1"
  );

  return Number(rows?.[0]?.total_visitas || 0);
}

async function registrarVisitante() {
  const data = await requestSupabase("rpc/registrar_visita_sitio", {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (typeof data === "number") {
    return data;
  }

  if (Array.isArray(data)) {
    const first = data[0];

    if (typeof first === "number") {
      return first;
    }

    if (first && typeof first.total_visitas !== "undefined") {
      return Number(first.total_visitas || 0);
    }

    if (first && typeof first.registrar_visita_sitio !== "undefined") {
      return Number(first.registrar_visita_sitio || 0);
    }
  }

  return obtenerVisitantes();
}

function eventConfig(){return {url:String(process.env.SUPABASE_URL||'').trim().replace(/^['"]|['"]$/g,'').replace(/\/rest\/v1\/?$/i,'').replace(/\/+$/,''),key:process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY};}
async function eventSb(path,options={}){const {url,key}=eventConfig();if(!url||!key)throw new Error('Faltan variables de conexión con Supabase.');const r=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:'application/json','Content-Type':'application/json',...(options.headers||{})}});const t=await r.text();let d=null;try{d=t?JSON.parse(t):null}catch{d=t}if(!r.ok)throw new Error(d?.message||d?.error||d?.details||'No fue posible completar la operación.');return d;}
const eventClean=v=>String(v||'').trim();
const eventPhone=v=>eventClean(v).replace(/\D/g,'');
function eventPublicEvent(e,count,winners){return {...e,participantes_count:count,disponibles:Math.max(0,Number(e.limite_boletos)-count),ganadores:winners.map(w=>({posicion:w.posicion,numero:w.participantes_evento?.numero,codigo:w.participantes_evento?.codigo,nombre_parcial:(eventClean(w.participantes_evento?.nombre).split(/\s+/)[0]||'Participante')+' '+((eventClean(w.participantes_evento?.nombre).split(/\s+/)[1]||'').slice(0,1)+(eventClean(w.participantes_evento?.nombre).split(/\s+/)[1]?'．':''))}))};}
async function handleCommunityEvents(req,res){res.setHeader('Cache-Control','no-store');try{
 if(req.method==='GET'&&req.query?.action==='consulta'){const eventoId=Number(req.query?.evento_id);const tel=eventPhone(req.query?.telefono);if(!eventoId||tel.length!==10)return res.status(400).json({error:'Ingresa un teléfono válido de 10 dígitos.'});const rows=await eventSb(`participantes_evento?select=numero,codigo,nombre,ciudad,fecha_registro&evento_id=eq.${eventoId}&telefono=eq.${tel}&limit=1`);if(!rows?.length)return res.status(404).json({error:'No encontramos un registro con ese teléfono.'});return res.status(200).json(rows[0]);}
 if(req.method==='GET'){const events=await eventSb('eventos_comunidad?select=id,nombre,tipo,producto_nombre,premio_plataforma,premio_enlace,premio_cupon,imagen_url,descripcion,fecha_sorteo,limite_boletos,cantidad_ganadores,estado,mostrar_contador,mostrar_participantes,publicar_ganador,prefijo&estado=in.(abierta,cerrada,finalizada)&order=creado_en.desc&limit=1');if(!events?.length)return res.status(200).json({evento:null});const e=events[0];const countRows=await eventSb(`participantes_evento?select=id&evento_id=eq.${e.id}&activo=eq.true`);let winners=[];if(e.publicar_ganador){winners=await eventSb(`ganadores_evento?select=posicion,participantes_evento(numero,codigo,nombre)&evento_id=eq.${e.id}&publicado=eq.true&order=posicion.asc`);}return res.status(200).json({evento:eventPublicEvent(e,countRows?.length||0,winners||[])});}
 if(req.method==='POST'){const eventoId=Number(req.body?.evento_id),nombre=eventClean(req.body?.nombre),tel=eventPhone(req.body?.telefono),ciudad=eventClean(req.body?.ciudad);if(!eventoId||nombre.length<3)return res.status(400).json({error:'Escribe tu nombre completo.'});if(tel.length!==10)return res.status(400).json({error:'Ingresa un teléfono válido de 10 dígitos.'});if(req.body?.acepta_privacidad!==true)return res.status(400).json({error:'Debes aceptar el aviso de privacidad.'});const data=await eventSb('rpc/registrar_participante_evento',{method:'POST',body:JSON.stringify({p_evento_id:eventoId,p_nombre:nombre,p_telefono:tel,p_ciudad:ciudad})});return res.status(201).json(data?.[0]||data);}
 res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Método no permitido.'});
 }catch(e){const msg=e.message||'Error interno.';const status=/cerrados|agotado|existe/i.test(msg)?409:500;return res.status(status).json({error:msg});}}


export default async function handler(request, response) {
  const rawAction = String(request.query?.action || "").trim();
  if (rawAction === "eventos" || rawAction.startsWith("eventos-")) {
    const originalQuery = request.query || {};
    request.query = { ...originalQuery, action: rawAction === "eventos" ? "" : rawAction.slice(8) };
    return handleCommunityEvents(request, response);
  }
  const action = String(request.query?.action || "").trim();

  /*
   * Contador de visitantes.
   * GET: consulta el total.
   * POST: incrementa y devuelve el nuevo total.
   */
  if (action === "visitantes") {
    if (!["GET", "POST"].includes(request.method)) {
      response.setHeader("Allow", "GET, POST");
      return response.status(405).json({
        error: "Método no permitido.",
      });
    }

    try {
      const total =
        request.method === "POST"
          ? await registrarVisitante()
          : await obtenerVisitantes();

      response.setHeader("Cache-Control", "no-store");

      return response.status(200).json({
        total_visitas: total,
      });
    } catch (error) {
      return response.status(500).json({
        error: error.message || "No se pudo cargar el contador de visitantes.",
      });
    }
  }

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({
      error: "Método no permitido.",
    });
  }

  try {
    if (action === "hero-config") {
      const config = await requestSupabase(
        "configuracion_web?select=logo_icono_url,nombre_sitio,eslogan,mostrar_eslogan,nombre_barra,imagen_url,color_inicio,color_fin,texto_descriptivo,nombre_boton_tienda,nombre_seccion_tienda,nombre_boton_bancarios,nombre_seccion_bancarios,nombre_boton_comunidad,descripcion_boton_comunidad,nombre_seccion_comunidad,nombre_boton_mercado_libre,nombre_boton_amazon,enlace_mercado_libre,enlace_amazon,enlace_whatsapp,enlace_facebook&id=eq.hero_redes&limit=1"
      );

      response.setHeader("Cache-Control", "no-store");

      return response.status(200).json(
        config?.[0] || {
          logo_icono_url: "",
          nombre_sitio: "Ofertas Imperdibles MX",
          eslogan: "Las mejores ofertas, siempre",
          mostrar_eslogan: true,
          nombre_barra: "Ofertas Imperdibles MX",
          imagen_url: "",
          color_inicio: "#e9cdff",
          color_fin: "#fae8fa",
          texto_descriptivo: "Cupones, promociones y novedades todos los días.",
          nombre_boton_tienda: "Tienda",
          nombre_seccion_tienda: "Cupones de tienda",
          nombre_boton_bancarios: "Bancarios",
          nombre_seccion_bancarios: "Cupones bancarios",
          nombre_boton_comunidad: "Comunidad Anirona",
          nombre_seccion_comunidad: "Comunidad Anirona",
          nombre_boton_mercado_libre: "Ofertas Mercado Libre",
          nombre_boton_amazon: "Ofertas Amazon",
          enlace_mercado_libre: "https://www.mercadolibre.com.mx/",
          enlace_amazon: "https://www.amazon.com.mx/",
          enlace_whatsapp: "https://whatsapp.com/channel/0029Vb75TftCxoAqrcjedS1n",
          enlace_facebook: "https://www.facebook.com/OfertasImperdiblesView",
        }
      );
    }

    const data = await requestSupabase(
      "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,categoria,enlace,activo,likes,clics,fecha_inicio,fecha_fin,fecha_creacion,fecha_publicacion,imagen_url&order=id.desc"
    );

    response.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=15, stale-while-revalidate=30"
    );

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Error interno del servidor.",
    });
  }
}
