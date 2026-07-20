(() => {
  "use strict";

  const encabezado = document.querySelector(".encabezado");
  const hero = encabezado?.querySelector(".hero-redes");
  const menu = encabezado?.querySelector(".menu-ofertas-contenedor");
  const comunidad = encabezado?.querySelector(".acceso-comunidad-anirona");

  if (!encabezado || !hero || !menu || !comunidad) return;

  /* Limpia cualquier cabecera generada por versiones anteriores. */
  document.querySelectorAll(".smart-header, .cabecera-hibrida, .cabecera-fija-original, .navegacion-principal-flujo").forEach((nodo) => nodo.remove());
  document.body.classList.remove("cabecera-compacta");
  encabezado.removeAttribute("data-compacta");

  /*
    V71.9: únicamente la barra social permanece fija.

    El logo sale naturalmente al desplazar. La barra original con imagen,
    nombre, redes y visitantes se vuelve sticky al llegar arriba. Los botones
    Mercado Libre, Amazon y Comunidad permanecen en el flujo normal, por lo
    que desaparecen de la pantalla al continuar bajando.
  */
  const barra = document.createElement("div");
  barra.className = "cabecera-fija-original";
  barra.setAttribute("data-cabecera-fija", "true");
  barra.setAttribute("aria-label", "Barra de Ofertas Imperdibles MX");

  const centinela = document.createElement("span");
  centinela.className = "cabecera-fija-centinela";
  centinela.setAttribute("aria-hidden", "true");

  const navegacion = document.createElement("div");
  navegacion.className = "navegacion-principal-flujo";
  navegacion.setAttribute("aria-label", "Accesos principales");

  encabezado.insertAdjacentElement("afterend", centinela);
  centinela.insertAdjacentElement("afterend", barra);
  barra.insertAdjacentElement("afterend", navegacion);

  barra.append(hero);
  navegacion.append(menu, comunidad);

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

  const observadorContenido = new MutationObserver(() => requestAnimationFrame(actualizarAltura));
  observadorContenido.observe(barra, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["hidden", "class"]
  });

  window.addEventListener("load", actualizarAltura, { once: true });
  window.addEventListener("pageshow", () => {
    actualizarAltura();
    establecerPegada(centinela.getBoundingClientRect().top < 0);
  });

  actualizarAltura();
})();
