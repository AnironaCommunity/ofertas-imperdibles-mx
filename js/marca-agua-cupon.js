// La marca propia tiene prioridad, incluso cuando el fondo general está desactivado.
export function aplicarMarcaAguaCupon(articulo, cupon) {
  const url = String(cupon.marca_agua_url || '').trim();
  if (url) {
    articulo.dataset.marcaAguaPropia = 'true';
    articulo.style.setProperty('--marca-agua-cupon-imagen', `url(${JSON.stringify(url)})`);
  } else {
    delete articulo.dataset.marcaAguaPropia;
    articulo.style.removeProperty('--marca-agua-cupon-imagen');
  }
}
