(() => {
  "use strict";

  const encabezado = document.querySelector(".encabezado");
  if (!encabezado) return;

  const CLASE_COMPACTA = "cabecera-compacta";

  /*
    Dos umbrales separados evitan que el cambio de altura de la cabecera
    active y desactive el mismo estado repetidamente.
  */
  const UMBRAL_COMPACTAR = 140;
  const UMBRAL_EXPANDIR = 4;

  let compacta = document.body.classList.contains(CLASE_COMPACTA);
  let pendiente = false;
  let ultimoDesplazamiento = Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0
  );
  let bloqueoHasta = 0;

  function obtenerDesplazamiento() {
    return Math.max(
      window.scrollY || 0,
      document.documentElement.scrollTop || 0
    );
  }

  function aplicarEstado(nuevoEstado) {
    if (nuevoEstado === compacta) return;

    compacta = nuevoEstado;
    bloqueoHasta = performance.now() + 360;

    document.body.classList.toggle(CLASE_COMPACTA, compacta);
    encabezado.setAttribute("data-compacta", String(compacta));

    /*
      Al expandirse ya estamos prácticamente en el inicio. Mantener el scroll
      en cero impide que el aumento de altura de la cabecera vuelva a cruzar
      el umbral de compactación y produzca parpadeo.
    */
    if (!compacta) {
      requestAnimationFrame(() => {
        window.scrollTo({ left: 0, top: 0, behavior: "auto" });
      });
    }
  }

  function actualizar() {
    const desplazamiento = obtenerDesplazamiento();
    const subiendo = desplazamiento < ultimoDesplazamiento;
    const bajando = desplazamiento > ultimoDesplazamiento;
    const bloqueada = performance.now() < bloqueoHasta;

    if (!bloqueada) {
      if (!compacta && bajando && desplazamiento >= UMBRAL_COMPACTAR) {
        aplicarEstado(true);
      } else if (compacta && subiendo && desplazamiento <= UMBRAL_EXPANDIR) {
        aplicarEstado(false);
      }
    }

    ultimoDesplazamiento = desplazamiento;
    pendiente = false;
  }

  function solicitarActualizacion() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }

  window.addEventListener("scroll", solicitarActualizacion, { passive: true });
  window.addEventListener("resize", solicitarActualizacion, { passive: true });
  window.addEventListener("pageshow", () => {
    ultimoDesplazamiento = obtenerDesplazamiento();
    solicitarActualizacion();
  });

  encabezado.setAttribute("data-compacta", String(compacta));
  solicitarActualizacion();
})();
