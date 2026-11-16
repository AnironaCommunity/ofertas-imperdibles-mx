import { normalizarFondo } from '../lib/fondo-cupones.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET','PUT'].includes(req.method)) { res.setHeader('Allow','GET, PUT'); return res.status(405).json({error:'Método no permitido.'}); }
  if (req.method === 'PUT' && (!process.env.ADMIN_PASSWORD || req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD)) return res.status(401).json({error:'Contraseña de administrador incorrecta.'});
  let config;
  if (req.method === 'PUT') {
    try { config = normalizarFondo(req.body); }
    catch (error) { return res.status(400).json({error:error.message}); }
  }
  const url = String(process.env.SUPABASE_URL || '').trim().replace(/^["']|["']$/g,'').replace(/\/rest\/v1\/?$/i,'').replace(/\/+$/,'');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({error:'Faltan variables de conexión con Supabase.'});
  try {
    const writing = req.method === 'PUT';
    const response = await fetch(`${url}/rest/v1/configuracion_web?${writing ? 'on_conflict=id' : 'select=imagen_url,texto_descriptivo&id=eq.fondo_cupones&limit=1'}`, {
      method: writing ? 'POST' : 'GET',
      headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json', ...(writing ? {Prefer:'resolution=merge-duplicates,return=minimal'} : {})},
      ...(writing ? {body:JSON.stringify({id:'fondo_cupones',imagen_url:config.imagen,texto_descriptivo:JSON.stringify({...config,imagen:undefined}),actualizado_en:new Date().toISOString()})} : {})
    });
    if (!response.ok) throw new Error('No fue posible acceder al fondo. Verifica la configuración de Supabase.');
    if (!writing) {
      const row = (await response.json())?.[0];
      config = row ? normalizarFondo({...JSON.parse(row.texto_descriptivo || '{}'),imagen:row.imagen_url}) : normalizarFondo();
    }
    return res.status(200).json(config);
  } catch (error) { return res.status(502).json({error:error.message || 'No fue posible guardar el fondo.'}); }
}
