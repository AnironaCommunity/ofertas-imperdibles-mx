function authorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") ===
      process.env.ADMIN_PASSWORD;
}

function supabaseConfig() {
  return {
    url: String(process.env.SUPABASE_URL || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/, ""),
    key:
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY,
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
  const data = text ? JSON.parse(text) : null;

  if (!result.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : typeof data?.details === "string"
            ? data.details
            : "Supabase no pudo completar la operación.";

    throw new Error(message);
  }

  return data;
}

function cleanText(value) {
  return String(value || "").trim();
}

function cleanExternalUrl(value, fallback) {
  const text = cleanText(value).slice(0, 500);
  if (!text) return fallback;
  try {
    const url = new URL(text);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

function normalizeCategory(value) {
  return value === "bancarios" ? "bancarios" : "tienda";
}

function eventAdminAuth(r){return Boolean(process.env.ADMIN_PASSWORD)&&String(r.headers['x-admin-password']||'')===process.env.ADMIN_PASSWORD;}
function eventAdminConfig(){return {url:String(process.env.SUPABASE_URL||'').trim().replace(/^['"]|['"]$/g,'').replace(/\/rest\/v1\/?$/i,'').replace(/\/+$/,''),key:process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY};}
async function eventAdminSb(path,options={}){const {url,key}=eventAdminConfig();if(!url||!key)throw new Error('Faltan variables de conexión con Supabase.');const r=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:'application/json','Content-Type':'application/json',...(options.headers||{})}});const t=await r.text();let d=null;try{d=t?JSON.parse(t):null}catch{d=t}if(!r.ok)throw new Error(d?.message||d?.error||d?.details||'Supabase no pudo completar la operación.');return d;}
const eventAdminClean=v=>String(v||'').trim();
function eventAdminPayload(b){return {nombre:eventAdminClean(b.nombre),tipo:eventAdminClean(b.tipo)||'rifa',producto_nombre:eventAdminClean(b.producto_nombre),premio_plataforma:['Mercado Libre','Amazon','Otra'].includes(eventAdminClean(b.premio_plataforma))?eventAdminClean(b.premio_plataforma):'Mercado Libre',premio_enlace:eventAdminClean(b.premio_enlace),premio_cupon:eventAdminClean(b.premio_cupon).toUpperCase().slice(0,50),imagen_url:eventAdminClean(b.imagen_url),descripcion:eventAdminClean(b.descripcion),fecha_sorteo:b.fecha_sorteo||null,limite_boletos:Number(b.limite_boletos),cantidad_ganadores:Number(b.cantidad_ganadores||1),estado:['borrador','abierta','cerrada','finalizada'].includes(b.estado)?b.estado:'borrador',mostrar_contador:b.mostrar_contador!==false,mostrar_participantes:b.mostrar_participantes===true,publicar_ganador:b.publicar_ganador!==false,prefijo:(eventAdminClean(b.prefijo)||'ANI').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8),actualizado_en:new Date().toISOString()};}
async function handleAdminCommunityEvents(req,res){if(!eventAdminAuth(req))return res.status(401).json({error:'Contraseña de administrador incorrecta.'});res.setHeader('Cache-Control','no-store');try{const action=eventAdminClean(req.query?.action);
 if(req.method==='GET'&&action==='participantes'){const id=Number(req.query?.evento_id);const data=await eventAdminSb(`participantes_evento?select=id,numero,codigo,nombre,telefono,ciudad,activo,fecha_registro&evento_id=eq.${id}&order=numero.asc`);return res.status(200).json(data);}
 if(req.method==='GET'&&action==='ganadores'){const id=Number(req.query?.evento_id);const data=await eventAdminSb(`ganadores_evento?select=id,posicion,publicado,premio_entregado,fecha_sorteo,participantes_evento(id,numero,codigo,nombre,telefono,ciudad)&evento_id=eq.${id}&order=posicion.asc`);return res.status(200).json(data);}
 if(req.method==='POST'&&action==='sortear'){const id=Number(req.body?.evento_id);const ev=(await eventAdminSb(`eventos_comunidad?select=id,cantidad_ganadores,estado&izar=id&id=eq.${id}&limit=1`.replace('&izar=id','')))?.[0];if(!ev) return res.status(404).json({error:'Evento no encontrado.'});const existing=await eventAdminSb(`ganadores_evento?select=participante_id&evento_id=eq.${id}`);const excluded=new Set((existing||[]).map(x=>x.participante_id));const participants=await eventAdminSb(`participantes_evento?select=id,numero,codigo,nombre,telefono,ciudad&evento_id=eq.${id}&activo=eq.true`);const pool=(participants||[]).filter(x=>!excluded.has(x.id));const needed=Math.max(0,Number(ev.cantidad_ganadores)-excluded.size);if(pool.length<needed||needed===0){if(needed===0)return res.status(409).json({error:'Este evento ya tiene todos sus ganadores.'});return res.status(409).json({error:'No hay suficientes participantes disponibles.'});}for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}const chosen=pool.slice(0,needed);const rows=chosen.map((p,i)=>({evento_id:id,participante_id:p.id,posicion:excluded.size+i+1,publicado:true}));await eventAdminSb('ganadores_evento',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(rows)});await eventAdminSb(`eventos_comunidad?id=eq.${id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({estado:'finalizada',actualizado_en:new Date().toISOString()})});return res.status(200).json(chosen);}
 if(req.method==='PATCH'&&action==='ganador'){const id=Number(req.body?.id);const body={};if(typeof req.body?.publicado==='boolean')body.publicado=req.body.publicado;if(typeof req.body?.premio_entregado==='boolean')body.premio_entregado=req.body.premio_entregado;await eventAdminSb(`ganadores_evento?id=eq.${id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});return res.status(200).json({ok:true});}
 if(req.method==='GET'){const data=await eventAdminSb('eventos_comunidad?select=*&order=creado_en.desc');for(const e of data||[]){const p=await eventAdminSb(`participantes_evento?select=id&evento_id=eq.${e.id}`);e.participantes_count=p?.length||0;}return res.status(200).json(data);}
 if(req.method==='POST'){const p=eventAdminPayload(req.body||{});if(!p.nombre||!p.producto_nombre||!Number.isInteger(p.limite_boletos)||p.limite_boletos<1)return res.status(400).json({error:'Nombre, producto y límite de boletos son obligatorios.'});const d=await eventAdminSb('eventos_comunidad',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(p)});return res.status(201).json(d?.[0]||d);}
 if(req.method==='PUT'){const id=Number(req.body?.id),p=eventAdminPayload(req.body||{});if(!id)return res.status(400).json({error:'Evento no válido.'});const d=await eventAdminSb(`eventos_comunidad?id=eq.${id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(p)});return res.status(200).json(d?.[0]||d);}
 if(req.method==='DELETE'){const id=Number(req.query?.id);await eventAdminSb(`eventos_comunidad?id=eq.${id}`,{method:'DELETE'});return res.status(204).end();}
 res.setHeader('Allow','GET, POST, PUT, PATCH, DELETE');return res.status(405).json({error:'Método no permitido.'});
 }catch(e){return res.status(500).json({error:e.message||'Error interno.'});}}


export default async function handler(request, response) {
  const rawAction = String(request.query?.action || "").trim();
  if (rawAction === "eventos" || rawAction.startsWith("eventos-")) {
    const originalQuery = request.query || {};
    request.query = { ...originalQuery, action: rawAction === "eventos" ? "" : rawAction.slice(8) };
    return handleAdminCommunityEvents(request, response);
  }
  if (!authorized(request)) {
    return response.status(401).json({
      error: "Contraseña de administrador incorrecta.",
    });
  }

  try {
    if (request.query?.action === "hero-config") {
      if (request.method === "GET") {
        const config = await requestSupabase(
          "configuracion_web?select=logo_icono_url,nombre_sitio,eslogan,mostrar_eslogan,nombre_barra,imagen_url,color_inicio,color_fin,texto_descriptivo,nombre_boton_tienda,nombre_seccion_tienda,nombre_boton_bancarios,nombre_seccion_bancarios,nombre_boton_comunidad,nombre_seccion_comunidad,nombre_boton_mercado_libre,nombre_boton_amazon,enlace_mercado_libre,enlace_amazon,estilo_color_boton_mercado_libre,estilo_color_boton_amazon,enlace_whatsapp,enlace_facebook&id=eq.hero_redes&limit=1"
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
            estilo_color_boton_mercado_libre: "marca",
            estilo_color_boton_amazon: "marca",
            enlace_mercado_libre: "https://www.mercadolibre.com.mx/",
            enlace_amazon: "https://www.amazon.com.mx/",
            enlace_whatsapp: "https://whatsapp.com/channel/0029Vb75TftCxoAqrcjedS1n",
            enlace_facebook: "https://www.facebook.com/OfertasImperdiblesView",
          }
        );
      }

      if (request.method === "PUT") {
        const cleanColor = (value, fallback) => {
          const color = String(value || "").trim();
          return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
        };

        const payload = {
          id: "hero_redes",
          logo_icono_url: cleanText(request.body?.logo_icono_url),
          nombre_sitio: cleanText(request.body?.nombre_sitio).slice(0, 70) || "Ofertas Imperdibles MX",
          eslogan: cleanText(request.body?.eslogan).slice(0, 120) || "Las mejores ofertas, siempre",
          mostrar_eslogan: request.body?.mostrar_eslogan !== false,
          nombre_barra: cleanText(request.body?.nombre_barra).slice(0, 70) || "Ofertas Imperdibles MX",
          imagen_url: cleanText(request.body?.imagen_url),
          color_inicio: cleanColor(
            request.body?.color_inicio,
            "#e9cdff"
          ),
          color_fin: cleanColor(
            request.body?.color_fin,
            "#fae8fa"
          ),
          texto_descriptivo: cleanText(request.body?.texto_descriptivo).slice(0, 120) || "Cupones, promociones y novedades todos los días.",
          nombre_boton_tienda: cleanText(request.body?.nombre_boton_tienda).slice(0, 35) || "Tienda",
          nombre_seccion_tienda: cleanText(request.body?.nombre_seccion_tienda).slice(0, 55) || "Cupones de tienda",
          nombre_boton_bancarios: cleanText(request.body?.nombre_boton_bancarios).slice(0, 35) || "Bancarios",
          nombre_seccion_bancarios: cleanText(request.body?.nombre_seccion_bancarios).slice(0, 55) || "Cupones bancarios",
          nombre_boton_comunidad: cleanText(request.body?.nombre_boton_comunidad).slice(0, 45) || "Comunidad Anirona",
          nombre_seccion_comunidad: cleanText(request.body?.nombre_seccion_comunidad).slice(0, 55) || "Comunidad Anirona",
          nombre_boton_mercado_libre: cleanText(request.body?.nombre_boton_mercado_libre).slice(0, 45) || "Ofertas Mercado Libre",
          nombre_boton_amazon: cleanText(request.body?.nombre_boton_amazon).slice(0, 45) || "Ofertas Amazon",
          estilo_color_boton_mercado_libre: request.body?.estilo_color_boton_mercado_libre === "barra" ? "barra" : "marca",
          estilo_color_boton_amazon: request.body?.estilo_color_boton_amazon === "barra" ? "barra" : "marca",
          enlace_mercado_libre: cleanExternalUrl(request.body?.enlace_mercado_libre, "https://www.mercadolibre.com.mx/"),
          enlace_amazon: cleanExternalUrl(request.body?.enlace_amazon, "https://www.amazon.com.mx/"),
          enlace_whatsapp: cleanText(request.body?.enlace_whatsapp).slice(0, 500) || "https://whatsapp.com/channel/0029Vb75TftCxoAqrcjedS1n",
          enlace_facebook: cleanText(request.body?.enlace_facebook).slice(0, 500) || "https://www.facebook.com/OfertasImperdiblesView",
          actualizado_en: new Date().toISOString(),
        };

        const data = await requestSupabase(
          "configuracion_web?on_conflict=id",
          {
            method: "POST",
            headers: {
              Prefer: "resolution=merge-duplicates,return=representation",
            },
            body: JSON.stringify(payload),
          }
        );

        return response.status(200).json(data?.[0] || payload);
      }

      response.setHeader("Allow", "GET, PUT");
      return response.status(405).json({
        error: "Método no permitido para la configuración de la barra.",
      });
    }

    if (request.method === "GET") {
      const data = await requestSupabase(
        "cupones?select=id,titulo,codigo,compra_minima,ahorro_maximo,categoria,enlace,activo,likes,clics,fecha_inicio,fecha_fin,fecha_creacion,fecha_publicacion,imagen_url&order=id.desc"
      );

      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json(data);
    }

    if (request.method === "POST") {
      const publicarComoNuevo =
        request.body?.publicar_como_nuevo !== false;

      const payload = {
        titulo: cleanText(request.body?.titulo),
        codigo: cleanText(request.body?.codigo),
        compra_minima: cleanText(request.body?.compra_minima),
        ahorro_maximo: cleanText(request.body?.ahorro_maximo),
        categoria: normalizeCategory(request.body?.categoria),
        enlace: cleanText(request.body?.enlace),
        imagen_url: cleanText(request.body?.imagen_url),
        activo: request.body?.activo !== false,
        fecha_inicio: request.body?.fecha_inicio || null,
        fecha_fin: request.body?.fecha_fin || null,
        fecha_publicacion: publicarComoNuevo
          ? new Date().toISOString()
          : null,
      };

      if (!payload.titulo || !payload.codigo || !payload.enlace) {
        return response.status(400).json({
          error: "Título, código y enlace son obligatorios.",
        });
      }

      const data = await requestSupabase("cupones", {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      return response.status(201).json(data?.[0] || data);
    }

    if (request.method === "PUT") {
      const id = Number(request.body?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          error: "ID de cupón no válido.",
        });
      }

      const payload = {};

      for (const field of [
        "titulo",
        "codigo",
        "compra_minima",
        "ahorro_maximo",
        "enlace",
        "imagen_url",
      ]) {
        if (Object.hasOwn(request.body || {}, field)) {
          payload[field] = cleanText(request.body[field]);
        }
      }

      if (Object.hasOwn(request.body || {}, "categoria")) {
        payload.categoria = normalizeCategory(request.body.categoria);
      }

      if (Object.hasOwn(request.body || {}, "activo")) {
        payload.activo = Boolean(request.body.activo);
      }

      if (Object.hasOwn(request.body || {}, "fecha_inicio")) {
        payload.fecha_inicio = request.body.fecha_inicio || null;
      }

      if (Object.hasOwn(request.body || {}, "fecha_fin")) {
        payload.fecha_fin = request.body.fecha_fin || null;
      }

      if (request.body?.publicar_como_nuevo === true) {
        payload.fecha_publicacion = new Date().toISOString();
      }

      const data = await requestSupabase(`cupones?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      return response.status(200).json(data?.[0] || data);
    }

    if (request.method === "DELETE") {
      const id = Number(request.query?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          error: "ID de cupón no válido.",
        });
      }

      await requestSupabase(`cupones?id=eq.${id}`, {
        method: "DELETE",
      });

      return response.status(200).json({ ok: true });
    }

    response.setHeader("Allow", "GET, POST, PUT, DELETE");
    return response.status(405).json({
      error: "Método no permitido.",
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || "Error interno del servidor.",
    });
  }
}
