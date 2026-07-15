const cuponesContainer = document.querySelector("#cupones");
const todosWrapper = document.querySelector("#todos-wrapper");
const sinCupones = document.querySelector("#sin-cupones");
const estadoCarga = document.querySelector("#estado-carga");
const botonRecargar = document.querySelector("#boton-recargar");
const contadorActualizacion = document.querySelector("#contador-actualizacion");
const ayudaCupones = document.querySelector("#ayuda-cupones");
const ayudaCuponesToggle = document.querySelector("#ayuda-cupones-toggle");
const ayudaCuponesContenido = document.querySelector("#ayuda-cupones-contenido");
const ayudaCuponesFlecha = document.querySelector("#ayuda-cupones-flecha");
const ayudaCuponesEntendido = document.querySelector("#ayuda-cupones-entendido");

const enlaceLogoInicio = document.querySelector("#enlace-logo-inicio");

const modalRedireccion = document.querySelector("#modal-redireccion");
const modalContador = document.querySelector("#modal-contador");
const cronometroNumero = document.querySelector("#cronometro-numero");
const modalCodigo = document.querySelector("#modal-codigo");
const modalCodigoBloque = document.querySelector("#modal-codigo-bloque");
const modalCuponOculto = document.querySelector("#modal-cupon-oculto");

const tabTienda = document.querySelector("#tab-tienda");
const tabBancarios = document.querySelector("#tab-bancarios");
const vistaCupones = document.querySelector("#vista-cupones");
const botonesMenuOfertas = document.querySelectorAll(".menu-ofertas [data-vista]");
const menuOfertas = document.querySelector(".menu-ofertas");
const botonMenuAnterior = document.querySelector("#menu-ofertas-anterior");
const botonMenuSiguiente = document.querySelector("#menu-ofertas-siguiente");
const indicadorMenuOfertas = document.querySelector(".menu-ofertas-indicador");
const contadorCuponesTienda = document.querySelector(
  "#contador-cupones-tienda"
);
const contadorOfertasMercadoLibre = document.querySelector(
  "#contador-ofertas-mercado-libre"
);
const contadorOfertasAmazon = document.querySelector(
  "#contador-ofertas-amazon"
);
const contadorComunidadAnirona = document.querySelector(
  "#contador-comunidad-anirona"
);
const contadorCuponesBancarios = document.querySelector(
  "#contador-cupones-bancarios"
);



const carruselesPublicidad = [];
const seccionComunidadAnirona = document.querySelector("#seccion-comunidad-anirona");
const seccionOfertasAmazon = document.querySelector("#seccion-ofertas-amazon");
const seccionOfertasMercadoLibre = document.querySelector("#seccion-ofertas-mercado-libre");
const ofertasComunidadAnirona = document.querySelector("#ofertas-comunidad-anirona");
const ofertasAmazon = document.querySelector("#ofertas-amazon");
const ofertasMercadoLibre = document.querySelector("#ofertas-mercado-libre");


const CLAVE_AYUDA_CUPONES_VISTA =
  "ofertas-imperdibles-ayuda-cupones-vista";

function establecerEstadoAyudaCupones(abierta, { animar = true } = {}) {
  if (!ayudaCupones || !ayudaCuponesToggle || !ayudaCuponesContenido || !ayudaCuponesFlecha) return;

  ayudaCupones.classList.toggle("abierta", abierta);
  ayudaCuponesToggle.setAttribute("aria-expanded", String(abierta));
  ayudaCuponesFlecha.textContent = abierta ? "▲" : "▼";

  if (!animar) {
    ayudaCuponesContenido.hidden = !abierta;
    ayudaCuponesContenido.style.maxHeight = abierta
      ? `${ayudaCuponesContenido.scrollHeight}px`
      : "0px";
    return;
  }

  if (abierta) {
    ayudaCuponesContenido.hidden = false;
    requestAnimationFrame(() => {
      ayudaCuponesContenido.style.maxHeight =
        `${ayudaCuponesContenido.scrollHeight}px`;
    });
  } else {
    ayudaCuponesContenido.style.maxHeight =
      `${ayudaCuponesContenido.scrollHeight}px`;
    requestAnimationFrame(() => {
      ayudaCuponesContenido.style.maxHeight = "0px";
    });
    window.setTimeout(() => {
      if (!ayudaCupones.classList.contains("abierta")) {
        ayudaCuponesContenido.hidden = true;
      }
    }, 260);
  }
}

function inicializarAyudaCupones() {
  if (!ayudaCupones) return;
  const yaFueVista =
    localStorage.getItem(CLAVE_AYUDA_CUPONES_VISTA) === "1";
  establecerEstadoAyudaCupones(!yaFueVista, { animar: false });
}

ayudaCuponesToggle?.addEventListener("click", () => {
  const abierta =
    ayudaCuponesToggle.getAttribute("aria-expanded") === "true";
  establecerEstadoAyudaCupones(!abierta);
});

ayudaCuponesEntendido?.addEventListener("click", () => {
  localStorage.setItem(CLAVE_AYUDA_CUPONES_VISTA, "1");
  establecerEstadoAyudaCupones(false);
});

window.addEventListener("resize", () => {
  if (ayudaCupones?.classList.contains("abierta") && !ayudaCuponesContenido?.hidden) {
    ayudaCuponesContenido.style.maxHeight =
      `${ayudaCuponesContenido.scrollHeight}px`;
  }
});

const SEGUNDOS_ACTUALIZACION = 60;
const SEGUNDOS_REDIRECCION = 3;
const MILISEGUNDOS_PUBLICIDAD = 8000;
const URL_PAGINA = "https://ofertasimperdiblesmx.vercel.app/";
const COLORES = ["turquesa", "azul", "morado", "coral", "oliva"];

let segundosRestantes = SEGUNDOS_ACTUALIZACION;
let cargando = false;
let redireccionEnProceso = false;
let timeoutRedireccion = null;
let categoriaActiva = "tienda";
let vistaActiva = "cupones";
let todosLosCupones = [];
let todasLasPublicidades = [];
let temporizadorEstados = null;

const SECCIONES_URL = {
  tienda: {
    vista: "cupones",
    categoria: "tienda",
  },
  bancarios: {
    vista: "cupones",
    categoria: "bancarios",
  },
  mercadolibre: {
    vista: "ofertas_mercado_libre",
  },
  amazon: {
    vista: "ofertas_amazon",
  },
  anirona: {
    vista: "comunidad_anirona",
  },
};

const TITULOS_SECCION = {
  tienda: "Cupones Tienda | Ofertas Imperdibles MX",
  bancarios: "Cupones Bancarios | Ofertas Imperdibles MX",
  mercadolibre: "Ofertas Mercado Libre | Ofertas Imperdibles MX",
  amazon: "Ofertas Amazon | Ofertas Imperdibles MX",
  anirona: "Comunidad Anirona | Ofertas Imperdibles MX",
};


function mostrarCantidadSeccion(elemento, cantidad, tipo) {
  if (!elemento) return;

  const total = Math.max(0, Number(cantidad) || 0);
  const singular = tipo === "cupón" ? "cupón" : "producto";
  const plural = tipo === "cupón" ? "cupones" : "productos";

  elemento.textContent = total > 99 ? "99+" : String(total);
  elemento.hidden = false;
  elemento.setAttribute(
    "aria-label",
    `${total} ${total === 1 ? singular : plural}`
  );
  elemento.title =
    `${total} ${total === 1 ? singular : plural}`;
}

function actualizarContadoresSecciones() {
  const cantidadTienda = todosLosCupones.filter(
    (cupon) =>
      normalizarCategoria(cupon) === "tienda" &&
      couponTimeState(cupon).state !== "finalizado"
  ).length;

  const cantidadMercadoLibre = todasLasPublicidades.filter(
    (publicidad) =>
      publicidad?.activo !== false &&
      publicidadPerteneceASeccion(
        publicidad,
        "ofertas_mercado_libre"
      )
  ).length;

  const cantidadAmazon = todasLasPublicidades.filter(
    (publicidad) =>
      publicidad?.activo !== false &&
      publicidadPerteneceASeccion(
        publicidad,
        "ofertas_amazon"
      )
  ).length;

  const cantidadComunidadAnirona = todasLasPublicidades.filter(
    (publicidad) =>
      publicidad?.activo !== false &&
      publicidadPerteneceASeccion(
        publicidad,
        "comunidad_anirona"
      )
  ).length;

  const cantidadBancarios = todosLosCupones.filter(
    (cupon) =>
      normalizarCategoria(cupon) === "bancarios" &&
      couponTimeState(cupon).state !== "finalizado"
  ).length;

  mostrarCantidadSeccion(
    contadorCuponesTienda,
    cantidadTienda,
    "cupón"
  );
  mostrarCantidadSeccion(
    contadorOfertasMercadoLibre,
    cantidadMercadoLibre,
    "producto"
  );
  mostrarCantidadSeccion(
    contadorOfertasAmazon,
    cantidadAmazon,
    "producto"
  );
  mostrarCantidadSeccion(
    contadorComunidadAnirona,
    cantidadComunidadAnirona,
    "producto"
  );
  mostrarCantidadSeccion(
    contadorCuponesBancarios,
    cantidadBancarios,
    "cupón"
  );
}

function actualizarTituloSeccion(seccion) {
  document.title =
    TITULOS_SECCION[seccion] ||
    "Ofertas Imperdibles MX";
}

const VISTA_A_SECCION_URL = {
  ofertas_mercado_libre: "mercadolibre",
  ofertas_amazon: "amazon",
  comunidad_anirona: "anirona",
};

function obtenerSeccionDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const seccion = String(parametros.get("seccion") || "").toLowerCase().trim();

  return SECCIONES_URL[seccion] ? seccion : "tienda";
}

function actualizarUrlSeccion(seccion, modo = "push") {
  if (!SECCIONES_URL[seccion]) return;

  const url = new URL(window.location.href);

  url.searchParams.set("seccion", seccion);
  actualizarTituloSeccion(seccion);

  const estado = { seccion };

  if (modo === "replace") {
    window.history.replaceState(estado, "", url);
  } else {
    window.history.pushState(estado, "", url);
  }
}

function activarSeccionDesdeUrl({
  actualizarHistorial = false,
  desplazamiento = "auto",
} = {}) {
  const seccion = obtenerSeccionDesdeUrl();
  const configuracion = SECCIONES_URL[seccion];

  actualizarTituloSeccion(seccion);

  if (configuracion.vista === "cupones") {
    categoriaActiva = configuracion.categoria;
    cambiarVista("cupones", {
      actualizarHistorial: false,
      desplazamiento,
    });
    renderizarCategoria();
  } else {
    cambiarVista(configuracion.vista, {
      actualizarHistorial: false,
      desplazamiento,
    });
  }

  const botonActivo = [...botonesMenuOfertas].find(
    (boton) => boton.dataset.vista === configuracion.vista
  );

  botonActivo?.scrollIntoView({
    behavior: desplazamiento === "smooth" ? "smooth" : "auto",
    block: "nearest",
    inline: "center",
  });

  if (actualizarHistorial) {
    actualizarUrlSeccion(seccion, "replace");
  }
}


enlaceLogoInicio?.addEventListener("click", (event) => {
  event.preventDefault();

  const inicio = new URL(window.location.origin);
  inicio.pathname = "/";
  inicio.search = "";
  inicio.hash = "";

  window.location.replace(inicio.toString());
});

botonRecargar.addEventListener("click", cargarCupones);
tabTienda.addEventListener("click", () =>
  cambiarCategoria("tienda", { actualizarHistorial: true })
);
tabBancarios.addEventListener("click", () =>
  cambiarCategoria("bancarios", { actualizarHistorial: true })
);

botonesMenuOfertas.forEach((boton) => {
  boton.addEventListener("click", () => {
    cambiarVista(boton.dataset.vista, {
      actualizarHistorial: true,
      desplazamiento: "smooth",
    });

    boton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    window.setTimeout(actualizarControlesMenuOfertas, 250);
  });
});

function actualizarControlesMenuOfertas() {
  if (!menuOfertas) return;

  const tolerancia = 4;
  const tieneDesbordamiento =
    menuOfertas.scrollWidth > menuOfertas.clientWidth + tolerancia;
  const alInicio = menuOfertas.scrollLeft <= tolerancia;
  const alFinal =
    menuOfertas.scrollLeft + menuOfertas.clientWidth >=
    menuOfertas.scrollWidth - tolerancia;

  if (botonMenuAnterior) {
    botonMenuAnterior.hidden = !tieneDesbordamiento || alInicio;
  }

  if (botonMenuSiguiente) {
    botonMenuSiguiente.hidden = !tieneDesbordamiento || alFinal;
  }

  if (indicadorMenuOfertas) {
    indicadorMenuOfertas.hidden = !tieneDesbordamiento || !alInicio;
  }

  menuOfertas.classList.toggle("puede-desplazar-izquierda", tieneDesbordamiento && !alInicio);
  menuOfertas.classList.toggle("puede-desplazar-derecha", tieneDesbordamiento && !alFinal);
}

function desplazarMenuOfertas(direccion) {
  if (!menuOfertas) return;

  const distancia = Math.max(menuOfertas.clientWidth * 0.72, 180);
  menuOfertas.scrollBy({
    left: direccion * distancia,
    behavior: "smooth",
  });
}

let temporizadorRecorridoSecciones = null;
let recorridoSeccionesActivo = false;

function cancelarRecorridoSecciones() {
  if (!recorridoSeccionesActivo) return;

  recorridoSeccionesActivo = false;

  if (temporizadorRecorridoSecciones) {
    window.clearTimeout(temporizadorRecorridoSecciones);
    temporizadorRecorridoSecciones = null;
  }
}

function iniciarRecorridoSecciones() {
  if (!menuOfertas) return;

  const tieneDesbordamiento =
    menuOfertas.scrollWidth > menuOfertas.clientWidth + 4;

  if (!tieneDesbordamiento) {
    return;
  }

  recorridoSeccionesActivo = true;

  /*
    El recorrido siempre debe regresar al inicio real del menú.
    No usamos scrollLeft como posición inicial porque el navegador puede
    haber centrado previamente la sección activa y dejar un desplazamiento.
  */
  const posicionInicial = 0;
  const posicionFinal =
    menuOfertas.scrollWidth - menuOfertas.clientWidth;

  temporizadorRecorridoSecciones = window.setTimeout(() => {
    if (!recorridoSeccionesActivo) return;

    menuOfertas.scrollTo({
      left: posicionFinal,
      behavior: "smooth",
    });

    temporizadorRecorridoSecciones = window.setTimeout(() => {
      if (!recorridoSeccionesActivo) return;

      menuOfertas.scrollTo({
        left: posicionInicial,
        behavior: "smooth",
      });

      temporizadorRecorridoSecciones = window.setTimeout(() => {
        menuOfertas.scrollTo({
          left: 0,
          behavior: "auto",
        });

        recorridoSeccionesActivo = false;
        actualizarControlesMenuOfertas();
      }, 850);
    }, 820);
  }, 700);
}

for (const evento of ["pointerdown", "touchstart", "wheel"]) {
  menuOfertas?.addEventListener(evento, cancelarRecorridoSecciones, {
    passive: true,
  });
}


botonMenuAnterior?.addEventListener("click", () => desplazarMenuOfertas(-1));
botonMenuSiguiente?.addEventListener("click", () => desplazarMenuOfertas(1));
menuOfertas?.addEventListener("scroll", actualizarControlesMenuOfertas, {
  passive: true,
});
window.addEventListener("resize", actualizarControlesMenuOfertas);
window.addEventListener("load", () => {
  actualizarControlesMenuOfertas();
  window.setTimeout(iniciarRecorridoSecciones, 250);
});
requestAnimationFrame(actualizarControlesMenuOfertas);

function cambiarVista(
  vista,
  {
    actualizarHistorial = false,
    desplazamiento = "smooth",
  } = {}
) {
  vistaActiva = vista;

  const vistas = [
    [vistaCupones, "cupones"],
    [seccionOfertasAmazon, "ofertas_amazon"],
    [seccionOfertasMercadoLibre, "ofertas_mercado_libre"],
    [seccionComunidadAnirona, "comunidad_anirona"],
  ];

  vistas.forEach(([seccion, nombre]) => {
    if (!seccion) return;
    const activa = nombre === vista;
    seccion.hidden = !activa;
    seccion.classList.toggle("vista-activa", activa);
    seccion.classList.toggle("vista-oculta", !activa);
  });

  const mostrarCupones = vista === "cupones";

  botonesMenuOfertas.forEach((boton) => {
    const activo = boton.dataset.vista === vista;
    boton.classList.toggle("activo", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });

  const tiendaActiva = mostrarCupones && categoriaActiva === "tienda";
  const bancariosActivos = mostrarCupones && categoriaActiva === "bancarios";
  tabTienda.classList.toggle("activo", tiendaActiva);
  tabBancarios.classList.toggle("activo", bancariosActivos);
  tabTienda.setAttribute("aria-pressed", String(tiendaActiva));
  tabBancarios.setAttribute("aria-pressed", String(bancariosActivos));

  if (actualizarHistorial) {
    const seccion =
      vista === "cupones"
        ? categoriaActiva
        : VISTA_A_SECCION_URL[vista];

    if (seccion) {
      actualizarUrlSeccion(seccion);
    }
  }

  window.scrollTo({
    top: 0,
    behavior: desplazamiento,
  });
}

function escaparHtml(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function iconoCompartir() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 16a3 3 0 0 0-2.39 1.19L8.91 13.7a3.1 3.1 0 0 0 0-3.4l6.7-3.49A3 3 0 1 0 15 5c0 .23.03.45.08.66l-6.7 3.49a3 3 0 1 0 0 5.7l6.7 3.49A3 3 0 1 0 18 16Z"/>
    </svg>
  `;
}

function iconoMeGusta() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4v12Zm2 0V9.38l3.21-5.35A2 2 0 0 1 17.93 5v3h2.38a2.69 2.69 0 0 1 2.62 3.29l-1.38 6A4.69 4.69 0 0 1 16.98 21H11Z"/>
    </svg>
  `;
}

function iconoCopias() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7V5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-2v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h2Zm3 1h3a3 3 0 0 1 3 3v2h2V5h-8v3Zm3 3H6v8h8v-8Z"/>
    </svg>
  `;
}

function claveUsado(id) {
  return `cupon-usado-${id}`;
}

function claveLike(id) {
  return `cupon-like-${id}`;
}

function couponTimeState(coupon) {
  const now = Date.now();
  const start = coupon.fecha_inicio
    ? new Date(coupon.fecha_inicio).getTime()
    : null;
  const end = coupon.fecha_fin
    ? new Date(coupon.fecha_fin).getTime()
    : null;

  if (start !== null && start > now) {
    return {
      state: "programado",
      target: start,
      start,
      end,
      label: "Disponible en",
      enabled: false,
    };
  }

  if (end !== null && end <= now) {
    return {
      state: "finalizado",
      target: end,
      start,
      end,
      label: "Finalizado",
      enabled: false,
    };
  }

  if (end !== null) {
    const remaining = end - now;

    let state = "activo";

    if (remaining <= 10 * 60 * 1000) {
      state = "ultimos-minutos";
    } else if (remaining <= 60 * 60 * 1000) {
      state = "finaliza-pronto";
    }

    return {
      state,
      target: end,
      start,
      end,
      label:
        state === "ultimos-minutos"
          ? "¡Últimos minutos!"
          : "Termina en",
      enabled: true,
    };
  }

  return {
    state: "activo",
    target: null,
    start,
    end,
    label: "",
    enabled: true,
  };
}

function formatRemaining(milliseconds) {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h`;
  }

  return (
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`
  );
}

function couponProgress(timeState) {
  const now = Date.now();

  if (
    timeState.start === null ||
    timeState.end === null ||
    timeState.end <= timeState.start
  ) {
    return 100;
  }

  if (timeState.state === "programado") {
    return 100;
  }

  const total = timeState.end - timeState.start;
  const remaining = timeState.end - now;

  return Math.max(
    0,
    Math.min(100, (remaining / total) * 100)
  );
}

function updateCouponTimes() {
  document.querySelectorAll(".cupon[data-id]").forEach((card) => {
    const coupon = todosLosCupones.find(
      (item) => String(item.id) === card.dataset.id
    );

    if (!coupon) return;

    const timeState = couponTimeState(coupon);
    const status = card.querySelector(".estado-programacion");
    const redeemButton = card.querySelector(".boton-canjear");

    status.className =
      `estado-programacion ${timeState.state}`;

    if (timeState.state === "programado") {
      status.hidden = false;
      status.innerHTML = `
        <div class="estado-linea">
          <span>${timeState.label}</span>
          <span class="estado-tiempo">
            ${formatRemaining(timeState.target - Date.now())}
          </span>
        </div>
      `;

      redeemButton.disabled = true;
      redeemButton.classList.add("boton-programado");
      redeemButton.textContent = "Disponible pronto";
      return;
    }

    if (timeState.state === "finalizado") {
      card.remove();

      if (!cuponesContainer.querySelector(".cupon[data-id]")) {
        todosWrapper.hidden = true;
        sinCupones.hidden = false;
      }

      return;
    }

    redeemButton.disabled = false;
    redeemButton.classList.remove("boton-programado");

    if (!redireccionEnProceso) {
      redeemButton.textContent = "⧉ Copiar y Canjear";
    }

    if (timeState.target !== null) {
      status.hidden = false;
      status.innerHTML = `
        <div class="estado-linea">
          <span>${timeState.label}</span>
          <span class="estado-tiempo">
            ${formatRemaining(timeState.target - Date.now())}
          </span>
        </div>
      `;
    } else {
      /*
        Sin fecha de finalización:
        se conserva la franja y la línea punteada,
        pero no se muestra ningún texto.
      */
      status.hidden = false;
      status.className = "estado-programacion vacio";
      status.replaceChildren();
    }
  });

}

function startCouponTimers() {
  if (temporizadorEstados) {
    clearInterval(temporizadorEstados);
  }

  updateCouponTimes();

  temporizadorEstados = window.setInterval(
    updateCouponTimes,
    1000
  );
}


const UNA_HORA_MS = 60 * 60 * 1000;
const MIN_CLICS_POPULAR = 2;

function fechaPublicacionCupon(cupon) {
  const valor = cupon?.fecha_publicacion;

  if (!valor) return null;

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

function esCuponNuevo(cupon) {
  const fecha = fechaPublicacionCupon(cupon);
  if (!fecha) return false;

  const antiguedad = Date.now() - fecha.getTime();

  return antiguedad >= 0 && antiguedad < UNA_HORA_MS;
}

function obtenerEstadoDestacadoCupon(
  cupon,
  idTop,
  idPopular
) {
  if (esCuponNuevo(cupon)) {
    return "nuevo";
  }

  if (
    idTop !== null &&
    Number(cupon.id) === Number(idTop)
  ) {
    return "top";
  }

  if (
    idPopular !== null &&
    Number(cupon.id) === Number(idPopular)
  ) {
    return "popular";
  }

  return "";
}

function htmlEtiquetaCupon(estado) {
  const etiquetas = {
    nuevo: '<span class="etiqueta-cupon etiqueta-nuevo">✨ Nuevo</span>',
    top: '<span class="etiqueta-cupon etiqueta-top">🏆 Top</span>',
    popular: '<span class="etiqueta-cupon etiqueta-popular-integrada">🔥 Popular</span>',
  };

  return etiquetas[estado] || "";
}

function crearTarjeta(cupon, estadoDestacado = "", indice = 0) {
  const articulo = document.createElement("article");
  const yaUsado = localStorage.getItem(claveUsado(cupon.id)) === "1";
  const yaLeGusta = localStorage.getItem(claveLike(cupon.id)) === "1";

  articulo.className = estadoDestacado
    ? `cupon cupon-${estadoDestacado}`
    : "cupon";
  articulo.dataset.id = String(cupon.id);
  articulo.dataset.color = COLORES[indice % COLORES.length];

  articulo.innerHTML = `
    <div class="cupon-encabezado">
      ${
        cupon.imagen_url
          ? `<img
              class="cupon-logo"
              src="${escaparHtml(cupon.imagen_url)}"
              alt=""
              loading="lazy"
            />`
          : ""
      }

      <h2 class="descuento">${escaparHtml(cupon.titulo)}</h2>
    </div>

    <div class="cupon-contenido">
      <div class="cupon-etiquetas">
        ${htmlEtiquetaCupon(estadoDestacado)}
      </div>

      <p class="descuento-maximo">
        Descuento máximo de
        <strong>${escaparHtml(cupon.ahorro_maximo || "Consultar")}</strong>
      </p>

      <p class="compra-minima">
        Compra mínima: ${escaparHtml(cupon.compra_minima || "Consultar")}
      </p>

      <div class="estado-programacion" hidden></div>

      <div class="cupon-usado" ${yaUsado ? "" : "hidden"}>
        ✓ Ya usaste este cupón
      </div>

      <div class="acciones-bloque">
        <div class="acciones-cupon">
          <button class="boton-canjear" type="button">
            ⧉ Copiar y Canjear
          </button>
        </div>

        <p class="mensaje" aria-live="polite"></p>

        <div class="acciones-secundarias">
          <button
            class="boton-like ${yaLeGusta ? "activo" : ""}"
            type="button"
            aria-label="Me gusta"
            title="Me gusta"
          >
            ${iconoMeGusta()}
          </button>

          <button
            class="boton-compartir"
            type="button"
            aria-label="Compartir página"
            title="Compartir página"
          >
            ${iconoCompartir()}
          </button>

          <div class="estadisticas-cupon">
            <span class="estadistica-item estadistica-likes">
              ${iconoMeGusta()}
              <span class="numero-likes">${Number(cupon.likes || 0)}</span>
            </span>

            <span class="estadistica-item estadistica-usos">
              ${iconoCopias()}
              <span class="numero-clics">${Number(cupon.clics || 0)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `;

  const initialTimeState = couponTimeState(cupon);
  const redeemButton = articulo.querySelector(".boton-canjear");

  if (!initialTimeState.enabled) {
    redeemButton.disabled = true;
    redeemButton.classList.add("boton-programado");
    redeemButton.textContent = "⏳ Disponible pronto";
  }

  redeemButton.addEventListener("click", () => {
    if (couponTimeState(cupon).enabled) {
      copiarYCanjear(cupon, articulo);
    }
  });

  articulo
    .querySelector(".boton-compartir")
    .addEventListener("click", () => compartirPagina(articulo));

  articulo
    .querySelector(".boton-like")
    .addEventListener("click", () => darMeGusta(cupon, articulo));

  return articulo;
}

function normalizarCategoria(cupon) {
  const categoria = String(cupon.categoria || "tienda").toLowerCase();

  return categoria === "bancario" || categoria === "bancarios"
    ? "bancarios"
    : "tienda";
}

function cambiarCategoria(
  categoria,
  {
    actualizarHistorial = false,
    desplazamiento = "smooth",
  } = {}
) {
  categoriaActiva = categoria;

  cambiarVista("cupones", {
    actualizarHistorial: false,
    desplazamiento,
  });

  const esTienda = categoria === "tienda";

  tabTienda.classList.toggle("activo", esTienda);
  tabBancarios.classList.toggle("activo", !esTienda);

  tabTienda.setAttribute("aria-pressed", String(esTienda));
  tabBancarios.setAttribute("aria-pressed", String(!esTienda));

  renderizarCategoria();

  if (actualizarHistorial) {
    actualizarUrlSeccion(categoria);
  }
}

function limpiarVista() {
  cuponesContainer.replaceChildren();
  todosWrapper.hidden = true;
  sinCupones.hidden = true;
}

function renderizarCategoria() {
  limpiarVista();

  const cuponesCategoria = todosLosCupones
    .filter((cupon) => normalizarCategoria(cupon) === categoriaActiva)
    .filter((cupon) => couponTimeState(cupon).state !== "finalizado")
    .sort((a, b) => {
      const stateA = couponTimeState(a);
      const stateB = couponTimeState(b);

      if (stateA.enabled !== stateB.enabled) {
        return stateA.enabled ? -1 : 1;
      }

      if (!stateA.enabled && !stateB.enabled) {
        return (
          Number(stateA.target || 0) -
          Number(stateB.target || 0)
        );
      }

      return Number(b.clics || 0) - Number(a.clics || 0);
    });

  const esTienda = categoriaActiva === "tienda";

  document.querySelector(".titulo-seccion").textContent = esTienda
    ? "🎟️ Cupones de tienda"
    : "💳 Cupones bancarios";

  if (cuponesCategoria.length === 0) {
    sinCupones.querySelector("h2").textContent = esTienda
      ? "No hay cupones de tienda disponibles"
      : "No hay cupones bancarios disponibles";

    sinCupones.querySelector("p").textContent =
      "Pronto agregaremos nuevas opciones.";

    sinCupones.hidden = false;
    estadoCarga.textContent = "";
    return;
  }

  const fragmento = document.createDocumentFragment();

  const cuponesActivos = cuponesCategoria.filter(
    (cupon) => couponTimeState(cupon).enabled
  );

  const cuponesClasificables = [...cuponesActivos]
    .filter((cupon) => !esCuponNuevo(cupon))
    .filter((cupon) => Number(cupon.clics || 0) > 0)
    .sort(
      (a, b) =>
        Number(b.clics || 0) - Number(a.clics || 0)
    );

  const cuponTop = cuponesClasificables[0] || null;

  const cuponPopular =
    cuponesClasificables.find(
      (cupon) =>
        Number(cupon.id) !== Number(cuponTop?.id) &&
        Number(cupon.clics || 0) >= MIN_CLICS_POPULAR
    ) || null;

  const idTop = cuponTop ? Number(cuponTop.id) : null;
  const idPopular = cuponPopular
    ? Number(cuponPopular.id)
    : null;

  cuponesCategoria.forEach((cupon, indice) => {
    const estadoDestacado = couponTimeState(cupon).enabled
      ? obtenerEstadoDestacadoCupon(
          cupon,
          idTop,
          idPopular
        )
      : "";

    fragmento.appendChild(
      crearTarjeta(cupon, estadoDestacado, indice)
    );
  });

  cuponesContainer.appendChild(fragmento);
  todosWrapper.hidden = false;
  estadoCarga.textContent = "";
  startCouponTimers();
}

function reiniciarContadorActualizacion() {
  segundosRestantes = SEGUNDOS_ACTUALIZACION;
  actualizarTextoContador();
}

function actualizarTextoContador() {
  if (contadorActualizacion) {
    contadorActualizacion.textContent = "";
  }
}

async function cargarCupones() {
  if (cargando || redireccionEnProceso) return;

  cargando = true;

  const esCargaInicial =
    !todosLosCupones.length &&
    !cuponesContainer.querySelector(".cupon[data-id]");

  if (esCargaInicial) {
    estadoCarga.className = "estado-carga";
    estadoCarga.textContent = "Cargando cupones...";
  } else {
    estadoCarga.textContent = "";
  }

  botonRecargar.disabled = true;

  try {
    const respuesta = await fetch("/api/cupones", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!respuesta.ok) {
      throw new Error("No fue posible consultar los cupones.");
    }

    const cupones = await respuesta.json();

    todosLosCupones = Array.isArray(cupones) ? cupones : [];
    renderizarCategoria();
    actualizarContadoresSecciones();
  } catch (error) {
    console.error(error);

    if (!todosLosCupones.length) {
      limpiarVista();
      estadoCarga.className = "estado-carga error";
      estadoCarga.textContent =
        "No pudimos cargar los cupones. Intenta actualizar la página.";
    } else {
      estadoCarga.textContent = "";
    }
  } finally {
    cargando = false;
    botonRecargar.disabled = false;
    reiniciarContadorActualizacion();
  }
}

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    const area = document.createElement("textarea");

    area.value = texto;
    area.style.position = "fixed";
    area.style.opacity = "0";

    document.body.appendChild(area);
    area.focus();
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

async function registrarClic(id) {
  const respuesta = await fetch("/api/clic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!respuesta.ok) {
    throw new Error("No fue posible registrar el clic.");
  }

  return respuesta.json();
}

async function registrarLike(id, accion) {
  const respuesta = await fetch("/api/cupon-like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id, accion }),
  });

  if (!respuesta.ok) {
    throw new Error("No fue posible registrar el Me gusta.");
  }

  return respuesta.json();
}

async function darMeGusta(cupon, tarjeta) {
  const boton = tarjeta.querySelector(".boton-like");
  const numero = tarjeta.querySelector(".numero-likes");
  const activo = boton.classList.contains("activo");
  const accion = activo ? "quitar" : "agregar";

  boton.disabled = true;

  try {
    const resultado = await registrarLike(cupon.id, accion);

    boton.classList.toggle("activo", accion === "agregar");
    numero.textContent = String(resultado.likes);

    if (accion === "agregar") {
      localStorage.setItem(claveLike(cupon.id), "1");
    } else {
      localStorage.removeItem(claveLike(cupon.id));
    }
  } catch (error) {
    console.warn(error);
  } finally {
    boton.disabled = false;
  }
}

function mostrarModal(codigo, mostrarCodigo = true) {
  modalCodigo.textContent = codigo || "";
  modalCodigoBloque.hidden = !mostrarCodigo;
  modalCuponOculto.hidden = mostrarCodigo;

  modalContador.textContent = String(SEGUNDOS_REDIRECCION);
  cronometroNumero.textContent = String(SEGUNDOS_REDIRECCION);
  modalRedireccion.hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modalRedireccion.hidden = true;
  document.body.style.overflow = "";
}

function reiniciarInteraccion() {
  if (timeoutRedireccion) {
    clearTimeout(timeoutRedireccion);
    timeoutRedireccion = null;
  }

  redireccionEnProceso = false;
  cerrarModal();

  document.querySelectorAll(".boton-canjear").forEach((boton) => {
    boton.disabled = false;
    boton.textContent = "⧉ Copiar y Canjear";
  });

  document.querySelectorAll(".mensaje").forEach((mensaje) => {
    mensaje.textContent = "";
  });
}

function ejecutarCuentaRegresiva(cupon, boton, mensaje) {
  let segundos = SEGUNDOS_REDIRECCION;

  const avanzar = () => {
    modalContador.textContent = String(segundos);
    cronometroNumero.textContent = String(segundos);

    if (segundos === 0) {
      cerrarModal();

      boton.disabled = false;
      boton.textContent = "⧉ Copiar y Canjear";
      mensaje.textContent = "";

      redireccionEnProceso = false;
      timeoutRedireccion = null;

      window.location.assign(cupon.enlace);
      return;
    }

    segundos -= 1;
    timeoutRedireccion = window.setTimeout(avanzar, 1000);
  };

  avanzar();
}

async function copiarYCanjear(cupon, tarjeta) {
  if (redireccionEnProceso || !couponTimeState(cupon).enabled) return;

  redireccionEnProceso = true;

  const boton = tarjeta.querySelector(".boton-canjear");
  const mensaje = tarjeta.querySelector(".mensaje");
  const numeroClics = tarjeta.querySelector(".numero-clics");
  const usado = tarjeta.querySelector(".cupon-usado");

  boton.disabled = true;
  boton.textContent = `✅ ${cupon.codigo}`;
  mensaje.textContent = "Cupón copiado correctamente.";

  modalRedireccion.querySelector("#modal-titulo").textContent =
    "¡Cupón copiado!";

  mostrarModal(cupon.codigo, true);

  try {
    await copiarTexto(cupon.codigo);

    localStorage.setItem(claveUsado(cupon.id), "1");
    usado.hidden = false;

    registrarClic(cupon.id)
      .then((resultado) => {
        if (Number.isFinite(Number(resultado.clics))) {
          numeroClics.textContent = String(resultado.clics);

          const couponIndex = todosLosCupones.findIndex(
            (item) => Number(item.id) === Number(cupon.id)
          );

          if (couponIndex >= 0) {
            todosLosCupones[couponIndex].clics = Number(resultado.clics);
          }
        }
      })
      .catch((error) => {
        console.warn("El contador no pudo actualizarse:", error);
      });

    ejecutarCuentaRegresiva(cupon, boton, mensaje);
  } catch (error) {
    console.error(error);
    reiniciarInteraccion();
    mensaje.textContent = "No fue posible copiar el cupón.";
  }
}

async function compartirPagina(tarjeta) {
  const mensaje = tarjeta.querySelector(".mensaje");
  const texto = `Mira este cupón de descuento publicado en ${URL_PAGINA}`;

  try {
    if (navigator.share) {
      await navigator.share({
        text: texto,
        url: URL_PAGINA,
      });

      mensaje.textContent = "Página compartida.";
    } else {
      await copiarTexto(texto);
      mensaje.textContent = "Enlace de la página copiado.";
    }

    setTimeout(() => {
      mensaje.textContent = "";
    }, 3500);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      mensaje.textContent = "No fue posible compartir la página.";
    }
  }
}

/* Publicidad y secciones de ofertas */
function crearControlCarrusel(wrapper) {
  const control = {
    wrapper,
    categoria: wrapper.dataset.categoriaPublicidad || "ofertas_dia",
    items: [],
    actual: 0,
    temporizador: null,
    inicioSwipeX: null,
    carrusel: wrapper.querySelector(".publicidad-carrusel"),
    contenido: wrapper.querySelector(".publicidad-contenido"),
    imagen: wrapper.querySelector("#publicidad-imagen, .publicidad-imagen"),
    titulo: wrapper.querySelector("#publicidad-titulo, .publicidad-titulo"),
    descripcion: wrapper.querySelector("#publicidad-descripcion, .publicidad-descripcion"),
    enlace: wrapper.querySelector("#publicidad-enlace, .publicidad-enlace"),
    precioPublicado: wrapper.querySelector("#publicidad-precio-publicado, .publicidad-precio-publicado"),
    precioCupon: wrapper.querySelector("#publicidad-precio-cupon, .publicidad-precio-cupon"),
    bloquePublicado: wrapper.querySelector("#precio-publicado-bloque, .precio-publicado-bloque"),
    bloqueCupon: wrapper.querySelector("#precio-cupon-bloque, .precio-cupon-bloque"),
    avisoCupon: wrapper.querySelector("#publicidad-aviso-cupon, .publicidad-aviso-cupon"),
    indicadores: wrapper.querySelector("#publicidad-indicadores, .publicidad-indicadores"),
    anterior: wrapper.querySelector("#publicidad-anterior, .publicidad-flecha-anterior"),
    siguiente: wrapper.querySelector("#publicidad-siguiente, .publicidad-flecha-siguiente"),
    compartir: wrapper.querySelector("#publicidad-compartir, .publicidad-compartir"),
    mensaje: wrapper.querySelector("#publicidad-mensaje, .publicidad-mensaje"),
  };

  control.anterior?.addEventListener("click", () => cambiarPublicidad(control, -1));
  control.siguiente?.addEventListener("click", () => cambiarPublicidad(control, 1));
  control.enlace?.addEventListener("click", (event) => {
    event.preventDefault();
    const item = control.items[control.actual];
    if (item) abrirPublicidad(item);
  });
  control.compartir?.addEventListener("click", () => {
    const item = control.items[control.actual];
    if (item) compartirPublicidad(item, control);
  });
  control.carrusel?.addEventListener("mouseenter", () => detenerRotacionPublicidad(control));
  control.carrusel?.addEventListener("mouseleave", () => iniciarRotacionPublicidad(control));
  control.carrusel?.addEventListener("focusin", () => detenerRotacionPublicidad(control));
  control.carrusel?.addEventListener("focusout", () => iniciarRotacionPublicidad(control));
  control.carrusel?.addEventListener("touchstart", (event) => {
    control.inicioSwipeX = event.touches[0]?.clientX ?? null;
  }, { passive: true });
  control.carrusel?.addEventListener("touchend", (event) => {
    if (control.inicioSwipeX === null) return;
    const finX = event.changedTouches[0]?.clientX ?? control.inicioSwipeX;
    const diferencia = finX - control.inicioSwipeX;
    if (Math.abs(diferencia) >= 45) cambiarPublicidad(control, diferencia > 0 ? -1 : 1);
    control.inicioSwipeX = null;
  }, { passive: true });

  return control;
}

function inicializarCarruselesPublicidad() {
  carruselesPublicidad.splice(0);
  document.querySelectorAll(".publicidad-wrapper[data-categoria-publicidad]").forEach((wrapper) => {
    carruselesPublicidad.push(crearControlCarrusel(wrapper));
  });
}



function obtenerPlataformaPublicidad(publicidad) {
  const plataforma = String(publicidad?.plataforma || "")
    .trim()
    .toLowerCase();

  if (plataforma === "amazon") return "amazon";
  if (plataforma === "mercadolibre") return "mercadolibre";

  const enlace = String(publicidad?.enlace || "").toLowerCase();

  return enlace.includes("amazon.") ||
    enlace.includes("a.co/")
    ? "amazon"
    : "mercadolibre";
}

function datosPlataformaPublicidad(publicidad) {
  const plataforma = obtenerPlataformaPublicidad(publicidad);

  return plataforma === "amazon"
    ? {
        nombre: "Amazon",
        textoBoton: "📦 Ver en Amazon",
      }
    : {
        nombre: "Mercado Libre",
        textoBoton: "🛒 Ver en Mercado Libre",
      };
}

function crearTarjetaOferta(publicidad, categoria) {
  const articulo = document.createElement("article");
  articulo.className = "tarjeta-oferta";
  articulo.dataset.publicidadId = String(publicidad.id || "");

  const plataforma = datosPlataformaPublicidad(publicidad);
  const precioPublicado = String(publicidad.precio_publicado || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  const codigo = String(publicidad.codigo_cupon || "").trim();

  articulo.innerHTML = `
    <button
      class="oferta-imagen-contenedor"
      type="button"
      aria-label="${escaparHtml(`Abrir ${publicidad.titulo || "oferta"} en ${plataforma.nombre}`)}"
      title="${`Ver en ${plataforma.nombre}`}"
    >
      <img
        class="oferta-imagen"
        src="${escaparHtml(publicidad.imagen_url || "")}" 
        alt="${escaparHtml(publicidad.titulo || "Oferta")}" 
        loading="lazy"
      />
    </button>

    <div class="oferta-contenido">
      <h3>${escaparHtml(publicidad.titulo || "Oferta destacada")}</h3>
      ${publicidad.descripcion ? `<p class="oferta-descripcion">${escaparHtml(publicidad.descripcion)}</p>` : ""}

      <div class="oferta-precios ${precioCupon ? "con-cupon" : ""}">
        ${precioPublicado ? `<div><span>Precio publicado</span><strong>${escaparHtml(precioPublicado)}</strong></div>` : ""}
        ${precioCupon ? `<div class="precio-destacado"><span>Precio con cupón</span><strong>${escaparHtml(precioCupon)}</strong></div>` : ""}
      </div>

      ${codigo ? `<p class="oferta-cupon">ℹ️ Al dar clic en <strong>${`Ver en ${plataforma.nombre}`}</strong>, el cupón se copiará automáticamente.</p>` : ""}

      <div class="oferta-meta">
        <span class="oferta-visitas" data-visitas-id="${Number(publicidad.id) || 0}">👁️ ${Number(publicidad.visitas) || 0} visitas</span>
      </div>

      <div class="oferta-acciones">
        <button class="oferta-ver" type="button">
          ${plataforma.textoBoton}
        </button>
        <button class="boton-compartir oferta-compartir" type="button" aria-label="Compartir oferta" title="Compartir">
          ${iconoCompartir()}
        </button>
      </div>
      <p class="oferta-mensaje" aria-live="polite"></p>
    </div>
  `;

  const mensaje = articulo.querySelector(".oferta-mensaje");
  const botonVer = articulo.querySelector(".oferta-ver");
  const botonImagen = articulo.querySelector(".oferta-imagen-contenedor");

  botonVer.addEventListener("click", () => abrirPublicidad(publicidad));
  botonImagen.addEventListener("click", () => abrirPublicidad(publicidad));

  articulo.querySelector(".oferta-compartir").addEventListener("click", () => {
    compartirPublicidad(publicidad, { mensaje });
  });

  const imagen = articulo.querySelector(".oferta-imagen");
  imagen.addEventListener("error", () => {
    imagen.closest(".oferta-imagen-contenedor").classList.add("sin-imagen");
    imagen.remove();
  }, { once: true });

  return articulo;
}



function crearTarjetaCanalAnirona() {
  const articulo = document.createElement("article");
  articulo.className = "tarjeta-oferta tarjeta-canal-anirona";

  articulo.innerHTML = `
    <div class="canal-anirona-logo" aria-hidden="true">
      <img src="img/anirona.png" alt="" loading="lazy" />
    </div>

    <div class="canal-anirona-contenido">
      <span class="canal-anirona-etiqueta">COMUNIDAD ANIRONA</span>
      <h3>¿Te gusta Anirona?</h3>

      <p>
        Sigue el canal para recibir promociones, cupones, lanzamientos,
        novedades y recomendaciones.
      </p>

      <div class="canal-anirona-temas" aria-label="Contenido del canal">
        <span>Promociones</span>
        <span>Cupones</span>
        <span>Lanzamientos</span>
        <span>Comunidad</span>
      </div>

      <a
        class="canal-anirona-boton"
        href="https://whatsapp.com/channel/0029VbCDDC0CRs1k2wM02q1i"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M19.11 17.54c-.23-.12-1.37-.68-1.58-.75-.21-.08-.37-.12-.52.12-.15.23-.6.75-.73.9-.14.15-.27.17-.5.06-.23-.12-.98-.36-1.87-1.16-.69-.62-1.16-1.38-1.3-1.61-.13-.23-.01-.36.1-.47.1-.1.23-.27.35-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.72-1.72-.19-.46-.38-.39-.52-.4h-.44c-.15 0-.4.06-.61.29-.21.23-.81.79-.81 1.93s.83 2.24.94 2.4c.12.15 1.63 2.49 3.95 3.49.55.24.98.38 1.32.49.55.18 1.05.15 1.45.09.44-.07 1.37-.56 1.56-1.1.19-.54.19-1 .13-1.1-.06-.09-.21-.15-.44-.27Z"/>
          <path d="M16.04 3C8.85 3 3 8.84 3 16.03c0 2.3.6 4.55 1.74 6.53L3 29l6.63-1.74a13 13 0 0 0 6.4 1.63h.01C23.22 28.89 29 23.05 29 15.86 29 8.68 23.22 3 16.04 3Zm0 23.55h-.01a10.66 10.66 0 0 1-5.44-1.49l-.39-.23-3.93 1.03 1.05-3.83-.25-.39a10.64 10.64 0 1 1 8.97 4.91Z"/>
        </svg>
        <span>Seguir canal en WhatsApp</span>
      </a>

      <small>Únete a la comunidad y no te pierdas las novedades.</small>
    </div>
  `;

  return articulo;
}



function normalizarSeccionesPublicidad(valor, categoria = "ofertas_dia") {
  let valores = [];

  if (Array.isArray(valor)) {
    valores = valor;
  } else if (typeof valor === "string") {
    const texto = valor.trim();

    if (texto) {
      try {
        const parsed = JSON.parse(texto);
        valores = Array.isArray(parsed) ? parsed : [];
      } catch {
        valores = texto
          .replace(/^\{|\}$/g, "")
          .split(",")
          .map((item) =>
            item.trim().replace(/^"|"$/g, "")
          )
          .filter(Boolean);
      }
    }
  }

  const permitidas = new Set([
    "ofertas_dia",
    "ofertas_mercado_libre",
    "ofertas_amazon",
    "comunidad_anirona",
  ]);

  const unicas = [...new Set(
    valores
      .map((item) => String(item || "").trim())
      .filter((item) => permitidas.has(item))
  )];

  const categoriaNormalizada = permitidas.has(categoria)
    ? categoria
    : "ofertas_dia";

  return unicas.length ? unicas : [categoriaNormalizada];
}

function publicidadPerteneceASeccion(publicidad, seccion) {
  const secciones = normalizarSeccionesPublicidad(
    publicidad?.secciones,
    publicidad?.categoria
  );

  return secciones.includes(seccion);
}

function renderizarModuloOfertas(categoria, contenedor, seccion) {
  const items = todasLasPublicidades.filter((item) =>
    publicidadPerteneceASeccion(item, categoria)
  );

  contenedor.replaceChildren();

  if (!items.length) {
    const mensaje = document.createElement("div");
    mensaje.className = "sin-ofertas-categoria";
    mensaje.innerHTML = `
      <div aria-hidden="true">🛍️</div>
      <h3>No hay ofertas disponibles</h3>
      <p>Pronto agregaremos nuevos productos en esta sección.</p>
    `;
    contenedor.appendChild(mensaje);
  } else {
    items.forEach((item) => {
      contenedor.appendChild(crearTarjetaOferta(item, categoria));
    });
  }

  if (categoria === "comunidad_anirona") {
    contenedor.appendChild(crearTarjetaCanalAnirona());
  }
}

const DURACION_VISITA_PRODUCTO_MS = 24 * 60 * 60 * 1000;

function claveVisitaPublicidad(id) {
  return `visita-publicidad-${id}`;
}

function visitaPublicidadVigente(id) {
  const clave = claveVisitaPublicidad(id);
  const registro = Number(localStorage.getItem(clave));

  if (!Number.isFinite(registro) || registro <= 0) {
    localStorage.removeItem(clave);
    return false;
  }

  if (Date.now() - registro >= DURACION_VISITA_PRODUCTO_MS) {
    localStorage.removeItem(clave);
    return false;
  }

  return true;
}

function actualizarVisitasEnPantalla(id, visitas) {
  document.querySelectorAll(`[data-visitas-id="${id}"]`).forEach((elemento) => {
    const total = Number(visitas) || 0;
    elemento.textContent = `👁️ ${total} ${total === 1 ? "visita" : "visitas"}`;
  });
}

async function registrarVisitaPublicidad(publicidad) {
  const id = Number(publicidad?.id);
  if (!Number.isInteger(id) || id <= 0) return;

  if (visitaPublicidadVigente(id)) return;

  const clave = claveVisitaPublicidad(id);
  localStorage.setItem(clave, String(Date.now()));

  try {
    const respuesta = await fetch("/api/publicidad-visita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    });

    if (!respuesta.ok) {
      throw new Error("No fue posible registrar la visita.");
    }

    const datos = await respuesta.json();
    publicidad.visitas = Number(datos.visitas) || 0;
    actualizarVisitasEnPantalla(id, publicidad.visitas);
  } catch (error) {
    localStorage.removeItem(clave);
    console.warn("No fue posible registrar la visita del producto.", error);
  }
}

async function cargarPublicidad() {
  try {
    const respuesta = await fetch("/api/publicidad", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!respuesta.ok) throw new Error("No fue posible consultar la publicidad.");

    const datos = await respuesta.json();
    todasLasPublicidades = Array.isArray(datos) ? datos : [];
    actualizarContadoresSecciones();

    renderizarModuloOfertas(
      "comunidad_anirona",
      ofertasComunidadAnirona,
      seccionComunidadAnirona
    );
    renderizarModuloOfertas(
      "ofertas_amazon",
      ofertasAmazon,
      seccionOfertasAmazon
    );
    renderizarModuloOfertas(
      "ofertas_mercado_libre",
      ofertasMercadoLibre,
      seccionOfertasMercadoLibre
    );

    cambiarVista(vistaActiva);

    for (const control of carruselesPublicidad) {
      control.items = todasLasPublicidades.filter((item) =>
        publicidadPerteneceASeccion(item, control.categoria)
      );
      control.actual = 0;
      detenerRotacionPublicidad(control);

      if (!control.items.length) {
        control.wrapper.hidden = true;
        continue;
      }

      control.wrapper.hidden = false;
      crearIndicadoresPublicidad(control);
      mostrarPublicidad(control);
      iniciarRotacionPublicidad(control);
    }
  } catch (error) {
    console.warn(error);
    carruselesPublicidad.forEach((control) => {
      control.wrapper.hidden = true;
      detenerRotacionPublicidad(control);
    });
    cambiarVista(vistaActiva);
  }
}

function crearIndicadoresPublicidad(control) {
  control.indicadores.replaceChildren();
  control.items.forEach((_, indice) => {
    const punto = document.createElement("button");
    punto.type = "button";
    punto.className = "publicidad-punto";
    punto.setAttribute("aria-label", `Mostrar oferta ${indice + 1}`);
    punto.addEventListener("click", () => {
      control.actual = indice;
      mostrarPublicidad(control);
      iniciarRotacionPublicidad(control);
    });
    control.indicadores.appendChild(punto);
  });
}

function mostrarPublicidad(control) {
  const publicidad = control.items[control.actual];
  if (!publicidad) return;

  control.contenido.style.animation = "none";
  void control.contenido.offsetWidth;
  control.contenido.style.animation = "";
  control.imagen.src = publicidad.imagen_url;
  control.imagen.alt = publicidad.titulo || "Oferta";
  control.titulo.textContent = publicidad.titulo || "Oferta destacada";
  control.descripcion.textContent = publicidad.descripcion || "";
  control.enlace.href = publicidad.enlace;

  const plataforma = datosPlataformaPublicidad(publicidad);

  control.enlace.textContent = plataforma.textoBoton;

  if (control.avisoCupon) {
    control.avisoCupon.innerHTML =
      `ℹ️ Al dar clic en <strong>Ver en ${plataforma.nombre}</strong>, ` +
      "el cupón se copiará automáticamente.";
  }

  const precioPublicado = String(publicidad.precio_publicado || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  const codigo = String(publicidad.codigo_cupon || "").trim();
  control.bloquePublicado.hidden = !precioPublicado;
  control.bloqueCupon.hidden = !precioCupon;
  control.avisoCupon.hidden = !codigo;
  const precios = control.wrapper.querySelector(".publicidad-precios");
  precios.classList.toggle("con-precio-cupon", Boolean(precioCupon));
  precios.classList.toggle("sin-precio-cupon", !precioCupon);
  control.precioPublicado.textContent = precioPublicado;
  control.precioCupon.textContent = precioCupon;
  [...control.indicadores.children].forEach((punto, indice) => {
    punto.classList.toggle("activo", indice === control.actual);
  });
  const mostrarControles = control.items.length > 1;
  control.anterior.hidden = !mostrarControles;
  control.siguiente.hidden = !mostrarControles;
  control.indicadores.hidden = !mostrarControles;
  control.mensaje.textContent = "";
}

function cambiarPublicidad(control, direccion) {
  if (control.items.length <= 1) return;
  control.actual = (control.actual + direccion + control.items.length) % control.items.length;
  mostrarPublicidad(control);
  iniciarRotacionPublicidad(control);
}

function iniciarRotacionPublicidad(control) {
  detenerRotacionPublicidad(control);
  if (control.items.length <= 1) return;
  control.temporizador = window.setInterval(() => cambiarPublicidad(control, 1), MILISEGUNDOS_PUBLICIDAD);
}

function detenerRotacionPublicidad(control) {
  if (control.temporizador) {
    clearInterval(control.temporizador);
    control.temporizador = null;
  }
}

function textoCompartirPublicidad(publicidad) {
  const lineas = [publicidad.titulo || "Oferta destacada"];
  if (publicidad.descripcion) lineas.push(publicidad.descripcion);
  if (publicidad.precio_publicado) lineas.push(`Precio publicado: ${publicidad.precio_publicado}`);
  if (publicidad.precio_cupon) lineas.push(`Precio con cupón: ${publicidad.precio_cupon}`);
  if (publicidad.codigo_cupon) lineas.push(`Cupón: ${publicidad.codigo_cupon}`);
  if (publicidad.enlace) lineas.push(publicidad.enlace);
  lineas.push("", `Más ofertas y cupones aquí ${URL_PAGINA}`);
  return lineas.join("\n");
}

async function compartirPublicidad(publicidad, control) {
  const texto = textoCompartirPublicidad(publicidad);
  try {
    if (navigator.share) {
      let archivoImagen = null;
      try {
        const respuesta = await fetch(publicidad.imagen_url, { mode: "cors" });
        if (respuesta.ok) {
          const blob = await respuesta.blob();
          const extension = blob.type.split("/")[1] || "jpg";
          archivoImagen = new File([blob], `oferta.${extension}`, { type: blob.type });
        }
      } catch (_) {
        archivoImagen = null;
      }

      if (archivoImagen && navigator.canShare?.({ files: [archivoImagen] })) {
        await navigator.share({ title: publicidad.titulo || "Oferta", text: texto, files: [archivoImagen] });
      } else {
        await navigator.share({ title: publicidad.titulo || "Oferta", text: texto, url: publicidad.enlace || URL_PAGINA });
      }
      control.mensaje.textContent = "Oferta compartida.";
    } else {
      await copiarTexto(texto);
      control.mensaje.textContent = "Información de la oferta copiada.";
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      control.mensaje.textContent = "No fue posible compartir la oferta.";
    }
  }
  setTimeout(() => { control.mensaje.textContent = ""; }, 3500);
}

async function abrirPublicidad(publicidad) {
  const enlace = String(publicidad.enlace || "").trim();
  if (!enlace) return;
  const codigo = String(publicidad.codigo_cupon || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  try {
    if (codigo) await copiarTexto(codigo);
    registrarVisitaPublicidad(publicidad);
    registrarClicPublicidad(publicidad.id);
    window.location.assign(enlace);
  } catch (error) {
    console.warn("No fue posible preparar la publicidad.", error);
    window.location.assign(enlace);
  }
}

async function registrarClicPublicidad(id) {
  try {
    await fetch("/api/publicidad-clic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    });
  } catch (error) {
    console.warn("No fue posible registrar el clic publicitario.", error);
  }
}

setInterval(() => {
  if (
    document.hidden ||
    cargando ||
    redireccionEnProceso ||
    !modalRedireccion.hidden
  ) {
    return;
  }

  segundosRestantes -= 1;

  if (segundosRestantes <= 0) {
    cargarCupones();
    cargarPublicidad();
    return;
  }

  actualizarTextoContador();
}, 1000);

window.addEventListener("pageshow", (event) => {
  reiniciarInteraccion();

  if (event.persisted) {
    cargarCupones();
    cargarPublicidad();
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    reiniciarInteraccion();
    carruselesPublicidad.forEach(iniciarRotacionPublicidad);
  } else {
    carruselesPublicidad.forEach(detenerRotacionPublicidad);
  }
});


window.addEventListener("popstate", () => {
  activarSeccionDesdeUrl({
    actualizarHistorial: false,
    desplazamiento: "auto",
  });
});

inicializarAyudaCupones();
inicializarCarruselesPublicidad();

const urlInicialTieneSeccion =
  new URLSearchParams(window.location.search).has("seccion");

activarSeccionDesdeUrl({
  actualizarHistorial: urlInicialTieneSeccion,
  desplazamiento: "auto",
});

cargarCupones();
cargarPublicidad();
