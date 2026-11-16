export function normalizarFondo(value = {}) {
  const imagen = String(value.imagen || '');
  if (imagen && (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(imagen) || imagen.length > 900000)) {
    throw new Error('Usa una imagen PNG, JPG o WebP optimizada de menos de 650 KB.');
  }
  const intensidad = Number(value.intensidad ?? 8);
  return { activo: value.activo === true && Boolean(imagen), imagen,
    intensidad: Number.isFinite(intensidad) ? Math.min(30, Math.max(0, intensidad)) : 8,
    posicion: ['left center','center center','right center'].includes(value.posicion) ? value.posicion : 'right center',
    tamano: ['contain','cover','55% auto'].includes(value.tamano) ? value.tamano : 'contain' };
}
