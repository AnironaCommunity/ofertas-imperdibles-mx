// Insignia informativa: no modifica el acceso, el código ni el canje del cupón.
export function aplicarInsigniaMeliPlus(articulo, cupon) {
  articulo.querySelector('.cupon-meli-plus-logo')?.remove();
  const activo = cupon.solo_meli_plus === true;
  articulo.classList.toggle('cupon-solo-meli-plus', activo);
  if (!activo) return;
  const logo = document.createElement('img');
  logo.className = 'cupon-meli-plus-logo';
  logo.src = '/img/meli-plus.png';
  logo.alt = 'Solo para usuarios Meli+';
  logo.title = 'Este cupón aplica solo para usuarios Meli+';
  logo.width = 54;
  logo.height = 20;
  logo.decoding = 'async';
  articulo.append(logo);
}
