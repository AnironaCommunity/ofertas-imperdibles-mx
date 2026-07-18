(() => {
  "use strict";

  const encabezado = document.querySelector(".encabezado");
  if (!encabezado) return;

  const CLASE_COMPACTA = "cabecera-compacta";
  const UMBRAL_COMPACTAR = 110;
  const UMBRAL_EXPANDIR = 28;
  let pendiente = false;
  let compacta = false;

  function actualizar() {
    const desplazamiento = Math.max(
      window.scrollY || 0,
      document.documentElement.scrollTop || 0
    );

    const debeCompactar = compacta
      ? desplazamiento > UMBRAL_EXPANDIR
      : desplazamiento >= UMBRAL_COMPACTAR;

    if (debeCompactar !== compacta) {
      compacta = debeCompactar;
      document.body.classList.toggle(CLASE_COMPACTA, compacta);
      encabezado.setAttribute("data-compacta", String(compacta));
    }

    pendiente = false;
  }

  function solicitarActualizacion() {
    if (pendiente) return;
    pendiente = true;
    window.requestAnimationFrame(actualizar);
  }

  window.addEventListener("scroll", solicitarActualizacion, { passive: true });
  window.addEventListener("resize", solicitarActualizacion, { passive: true });
  window.addEventListener("pageshow", solicitarActualizacion);

  actualizar();
})();
