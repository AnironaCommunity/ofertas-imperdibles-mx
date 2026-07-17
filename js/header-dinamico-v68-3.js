(() => {
  const textoEstado = document.querySelector("#estado-dinamico-texto");
  const cajaEstado = document.querySelector(".estado-dinamico-cabecera");
  const navegacionInferior = document.querySelector(".navegacion-inferior");
  const tabTienda = document.querySelector("#tab-tienda");
  const tabBancarios = document.querySelector("#tab-bancarios");
  const tabContextual = document.querySelector("#tab-seccion-contextual");
  const contextualTexto = document.querySelector("#tab-seccion-contextual-texto");
  const contextualIcono = document.querySelector("#tab-seccion-contextual-icono");
  const contextualContador = document.querySelector("#contador-seccion-contextual");

  if (!textoEstado || !cajaEstado || !navegacionInferior) return;

  const SECCIONES = {
    tienda: {
      nombre: "Tienda",
      icono: "🛒",
      contador: "#contador-cupones-tienda",
      unidad: "cupones",
    },
    bancarios: {
      nombre: "Bancarios",
      icono: "💳",
      contador: "#contador-cupones-bancarios",
      unidad: "cupones",
    },
    mercadolibre: {
      nombre: "Mercado Libre",
      icono: "🛒",
      contador: "#contador-ofertas-mercado-libre",
      unidad: "ofertas",
    },
    amazon: {
      nombre: "Amazon",
      icono: "📦",
      contador: "#contador-ofertas-amazon",
      unidad: "ofertas",
    },
    anirona: {
      nombre: "Comunidad Anirona",
      icono: "👥",
      contador: "#contador-comunidad-anirona",
      unidad: "publicaciones",
    },
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

  function seccionActual() {
    const valor = new URLSearchParams(location.search).get("seccion");
    return SECCIONES[valor] ? valor : "tienda";
  }

  function construirMensajes() {
    const tienda = numero(SECCIONES.tienda.contador);
    const bancarios = numero(SECCIONES.bancarios.contador);
    const ml = numero(SECCIONES.mercadolibre.contador);
    const amazon = numero(SECCIONES.amazon.contador);
    const anirona = numero(SECCIONES.anirona.contador);
    const totalCupones = tienda + bancarios;

    const nuevos = [];
    if (totalCupones > 0) nuevos.push(`🎟️ ${totalCupones} cupones disponibles para ahorrar hoy`);
    if (ml > 0) nuevos.push(`🔥 ${ml} ofertas de Mercado Libre para descubrir`);
    if (amazon > 0) nuevos.push(`📦 ${amazon} ofertas disponibles en Amazon`);
    if (anirona > 0) nuevos.push(`👥 Comunidad Anirona tiene ${anirona} publicaciones activas`);
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

  function actualizarBarraInferior() {
    const clave = seccionActual();
    const config = SECCIONES[clave];
    const esCupones = clave === "tienda" || clave === "bancarios";

    navegacionInferior.classList.toggle("modo-contextual", !esCupones);

    if (esCupones) {
      tabContextual.hidden = true;
      tabTienda.hidden = false;
      tabBancarios.hidden = false;
      return;
    }

    const total = numero(config.contador);
    tabContextual.hidden = false;
    contextualTexto.textContent = config.nombre;
    contextualIcono.textContent = config.icono;
    contextualContador.textContent = total > 99 ? "99+" : String(total);
    contextualContador.setAttribute(
      "aria-label",
      `${total} ${config.unidad}`
    );
    contextualContador.title = `${total} ${config.unidad}`;
  }

  function actualizarTodo() {
    actualizarBarraInferior();
    construirMensajes();
  }

  tabContextual?.addEventListener("click", () => {
    const clave = seccionActual();
    const selector = {
      mercadolibre: '[data-vista="ofertas_mercado_libre"]',
      amazon: '[data-vista="ofertas_amazon"]',
      anirona: '[data-vista="comunidad_anirona"]',
    }[clave];
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-vista], #tab-tienda, #tab-bancarios")) {
      window.setTimeout(() => {
        actualizarTodo();
        reiniciarRotacion();
      }, 80);
    }
  });

  window.addEventListener("popstate", () => {
    window.setTimeout(() => {
      actualizarTodo();
      reiniciarRotacion();
    }, 50);
  });

  const observados = Object.values(SECCIONES)
    .map((config) => document.querySelector(config.contador))
    .filter(Boolean);

  const observer = new MutationObserver(() => {
    actualizarTodo();
    reiniciarRotacion();
  });
  observados.forEach((elemento) => observer.observe(elemento, { childList: true, characterData: true, subtree: true }));

  actualizarTodo();
  reiniciarRotacion();
})();
