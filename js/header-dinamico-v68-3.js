(() => {
  const textoEstado = document.querySelector("#estado-dinamico-texto");
  const cajaEstado = document.querySelector(".estado-dinamico-cabecera");

  if (!textoEstado || !cajaEstado) return;

  const CONTADORES = {
    tienda: "#contador-cupones-tienda",
    bancarios: "#contador-cupones-bancarios",
    mercadolibre: "#contador-ofertas-mercado-libre",
    amazon: "#contador-ofertas-amazon",
    anirona: "#contador-comunidad-anirona",
  };

  let mensajes = [];
  let indiceMensaje = 0;
  let intervalo = null;
  let textoActual = "";

  function numero(selector) {
    const valor = document.querySelector(selector)?.textContent?.trim() || "0";
    const limpio = Number.parseInt(valor.replace(/\D/g, ""), 10);
    return Number.isFinite(limpio) ? limpio : 0;
  }

  function construirMensajes() {
    const tienda = numero(CONTADORES.tienda);
    const bancarios = numero(CONTADORES.bancarios);
    const ml = numero(CONTADORES.mercadolibre);
    const amazon = numero(CONTADORES.amazon);
    const anirona = numero(CONTADORES.anirona);
    const totalCupones = tienda + bancarios;

    const nuevos = [];
    if (totalCupones > 0) nuevos.push(`🎟️ ${totalCupones} cupones disponibles para ahorrar hoy`);
    if (ml > 0) nuevos.push(`🔥 ${ml} ofertas de Mercado Libre para descubrir`);
    if (amazon > 0) nuevos.push(`📦 ${amazon} ofertas disponibles en Amazon`);
    if (anirona > 0) nuevos.push(`👥 ${anirona} novedades activas en Comunidad Anirona`);
    nuevos.push("⚡ Cupones, promociones y novedades actualizadas todos los días");

    mensajes = [...new Set(nuevos)];
    if (indiceMensaje >= mensajes.length) indiceMensaje = 0;
  }

  function mostrarMensaje(texto, inmediato = false) {
    if (!texto || texto === textoActual) return;
    textoActual = texto;

    if (inmediato || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      textoEstado.textContent = texto;
      return;
    }

    cajaEstado.classList.add("cambiando");
    window.setTimeout(() => {
      textoEstado.textContent = texto;
      cajaEstado.classList.remove("cambiando");
    }, 190);
  }

  function rotarMensaje() {
    construirMensajes();
    if (!mensajes.length) return;
    mostrarMensaje(mensajes[indiceMensaje]);
    indiceMensaje = (indiceMensaje + 1) % mensajes.length;
  }

  function reiniciarRotacion() {
    if (intervalo) window.clearInterval(intervalo);
    construirMensajes();
    mostrarMensaje(mensajes[0], true);
    indiceMensaje = mensajes.length > 1 ? 1 : 0;
    intervalo = window.setInterval(rotarMensaje, 4500);
  }

  /*
   * La navegación inferior se deja intacta: siempre conserva Tienda y Bancarios.
   * Las secciones superiores ya no modifican ni reemplazan la opción Bancarios.
   */
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-vista], #tab-tienda, #tab-bancarios")) {
      window.setTimeout(reiniciarRotacion, 80);
    }
  });

  const observados = Object.values(CONTADORES)
    .map((selector) => document.querySelector(selector))
    .filter(Boolean);

  const observer = new MutationObserver(reiniciarRotacion);
  observados.forEach((elemento) => observer.observe(elemento, {
    childList: true,
    characterData: true,
    subtree: true,
  }));

  reiniciarRotacion();
})();
