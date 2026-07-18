(() => {
  "use strict";

  const encabezado = document.querySelector(".encabezado");
  const hero = encabezado?.querySelector(".hero-redes");
  const menu = encabezado?.querySelector(".menu-ofertas-contenedor");
  const comunidad = encabezado?.querySelector(".acceso-comunidad-anirona");

  if (!encabezado || !hero || !menu || !comunidad) return;

  /* Limpia cualquier cabecera generada por V71.0/V71.1. */
  document.querySelectorAll(".smart-header, .cabecera-hibrida, .cabecera-fija-original").forEach((nodo) => nodo.remove());
  document.body.classList.remove("cabecera-compacta");
  encabezado.removeAttribute("data-compacta");

  /*
    V71.2: la barra que ya existe en la página se separa del logo.

    El logo y el estado dinámico permanecen en el encabezado superior y salen
    naturalmente al desplazar. La barra original (imagen, redes, visitantes,
    ofertas y comunidad) se mantiene en el flujo y se vuelve sticky al llegar
    arriba. Al no usar position:fixed ni clonar elementos, nunca cubre el título
    ni el primer cupón.
  */
  const barra = document.createElement("div");
  barra.className = "cabecera-fija-original";
  barra.setAttribute("data-cabecera-fija", "true");
  barra.setAttribute("aria-label", "Redes y secciones de Ofertas Imperdibles MX");

  const centinela = document.createElement("span");
  centinela.className = "cabecera-fija-centinela";
  centinela.setAttribute("aria-hidden", "true");

  encabezado.insertAdjacentElement("afterend", centinela);
  centinela.insertAdjacentElement("afterend", barra);

  barra.append(hero, menu, comunidad);

  const raiz = document.documentElement;
  let alturaAnterior = 0;

  function actualizarAltura() {
    const altura = Math.ceil(barra.getBoundingClientRect().height);
    if (!altura || altura === alturaAnterior) return;
    alturaAnterior = altura;
    raiz.style.setProperty("--cabecera-fija-alto", `${altura}px`);
  }

  function establecerPegada(pegada) {
    barra.classList.toggle("esta-pegada", pegada);
    document.body.classList.toggle("cabecera-original-pegada", pegada);
  }

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(([entrada]) => {
      establecerPegada(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    }, { threshold: 0 });
    observador.observe(centinela);
  } else {
    let pendiente = false;
    const revisar = () => {
      pendiente = false;
      establecerPegada(centinela.getBoundingClientRect().top < 0);
    };
    window.addEventListener("scroll", () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(revisar);
    }, { passive: true });
    revisar();
  }

  if ("ResizeObserver" in window) {
    const observadorTamano = new ResizeObserver(() => requestAnimationFrame(actualizarAltura));
    observadorTamano.observe(barra);
  } else {
    window.addEventListener("resize", actualizarAltura, { passive: true });
  }

  /* Recalcula cuando cambian textos, contadores o configuración remota. */
  const observadorContenido = new MutationObserver(() => requestAnimationFrame(actualizarAltura));
  observadorContenido.observe(barra, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["hidden", "class", "aria-pressed"]
  });

  window.addEventListener("load", actualizarAltura, { once: true });
  window.addEventListener("pageshow", () => {
    actualizarAltura();
    establecerPegada(centinela.getBoundingClientRect().top < 0);
  });

  actualizarAltura();
})();
