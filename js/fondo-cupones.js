import { normalizarFondo } from '../lib/fondo-cupones.js';
export function aplicarFondo(elemento, value) {
  const config = normalizarFondo(value);
  elemento.style.setProperty('--fondo-cupon-imagen', config.imagen ? `url("${config.imagen}")` : 'none');
  elemento.style.setProperty('--fondo-cupon-velo', `rgba(255,255,255,${1-config.intensidad/100})`);
  elemento.style.setProperty('--fondo-cupon-posicion', config.posicion);
  elemento.style.setProperty('--fondo-cupon-tamano', config.tamano);
  return config;
}
// Sin caché local: desactivar o reemplazar el fondo se refleja al abrir o volver a la página.
async function cargarFondo() {
  try {
    const response = await fetch('/api/fondo-cupones', {cache:'no-store'});
    if (!response.ok) throw new Error('Fondo no disponible');
    const config = aplicarFondo(document.documentElement, await response.json());
    document.documentElement.dataset.fondoCupones = config.activo ? 'activo' : 'inactivo';
  } catch { document.documentElement.dataset.fondoCupones = 'inactivo'; }
}
if (document.querySelector('#cupones')) {
  cargarFondo();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) cargarFondo(); });
}
