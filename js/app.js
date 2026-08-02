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
const botonComunidadAnirona = document.querySelector(".acceso-comunidad-anirona[data-vista]");
const menuOfertas = document.querySelector(".menu-ofertas");
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
const buscarCatalogoAnirona = document.querySelector("#buscar-catalogo-anirona");
const limpiarBusquedaAnirona = document.querySelector("#limpiar-busqueda-anirona");
const resultadosCatalogoAnirona = document.querySelector("#resultados-catalogo-anirona");
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
      cupon.activo !== false &&
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
      cupon.activo !== false &&
      normalizarCategoria(cupon) === "bancarios" &&
      couponTimeState(cupon).state !== "finalizado"
  ).length;

  mostrarCantidadSeccion(
    contadorCuponesTienda,
    cantidadTienda,
    "cupón"
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

function abrirEnlacePrincipal(boton) {
  const vista = boton?.dataset?.vista;
  const cache = (() => {
    try {
      return JSON.parse(localStorage.getItem("ofertas_imperdibles_config_cache") || "{}");
    } catch {
      return {};
    }
  })();

  const url = boton?.dataset?.enlaceExterno ||
    (vista === "ofertas_mercado_libre"
      ? window.ofertasEnlacesPrincipales?.mercadoLibre || cache.enlace_mercado_libre
      : window.ofertasEnlacesPrincipales?.amazon || cache.enlace_amazon);

  if (!url) return;

  try {
    const destino = new URL(url, window.location.origin);
    if (!["http:", "https:"].includes(destino.protocol)) return;
    window.location.href = destino.toString();
  } catch (error) {
    console.warn("La liga configurada no es válida.", error);
  }
}

botonesMenuOfertas.forEach((boton) => {
  boton.addEventListener("click", () => abrirEnlacePrincipal(boton));
});

botonComunidadAnirona?.addEventListener("click", () => {
  cambiarVista(botonComunidadAnirona.dataset.vista, {
    actualizarHistorial: true,
    desplazamiento: "smooth",
  });
});


function cambiarVista(
  vista,
  {
    actualizarHistorial = false,
    desplazamiento = "smooth",
    moverAlInicio = true,
  } = {}
) {
  vistaActiva = vista;

  // La navegación ML/Amazon es una cuadrícula fija; nunca conserva desplazamiento horizontal.
  if (menuOfertas) menuOfertas.scrollLeft = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
  window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });

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

  if (botonComunidadAnirona) {
    const comunidadActiva = vista === botonComunidadAnirona.dataset.vista;
    botonComunidadAnirona.classList.toggle("activo", comunidadActiva);
    botonComunidadAnirona.setAttribute("aria-pressed", String(comunidadActiva));
  }

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

  if (moverAlInicio) {
    window.scrollTo({
      top: 0,
      behavior: desplazamiento,
    });
  }
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
      redeemButton.textContent = "📋 Copiar y Canjear";
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
            📋 Copiar y Canjear
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
    /* La activación manual tiene prioridad sobre la vigencia. */
    .filter((cupon) => cupon.activo !== false)
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

  const etiquetas = window.ofertasEtiquetas || {};
  const tituloCupones = document.querySelector("#titulo-seccion-cupones");
  if (tituloCupones) {
    tituloCupones.textContent = esTienda
      ? `🎟️ ${etiquetas.seccionTienda || "Cupones de tienda"}`
      : `💳 ${etiquetas.seccionBancarios || "Cupones bancarios"}`;
  }

  if (cuponesCategoria.length === 0) {
    sinCupones.querySelector("h2").textContent = esTienda
      ? `No hay ${(etiquetas.seccionTienda || "cupones de tienda").toLowerCase()} disponibles`
      : `No hay ${(etiquetas.seccionBancarios || "cupones bancarios").toLowerCase()} disponibles`;

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
    revisarAvisosNovedades();
    procesarNovedadDesdeUrl();
    revisarAvisosNovedades();
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
    boton.textContent = "📋 Copiar y Canjear";
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
      boton.textContent = "📋 Copiar y Canjear";
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

const DURACION_NUEVO_CATALOGO_MS = 5 * 24 * 60 * 60 * 1000;

function esProductoNuevoVigente(publicidad) {
  if (!publicidad?.es_nuevo || !publicidad?.fecha_nuevo) return false;
  const fecha = new Date(publicidad.fecha_nuevo).getTime();
  return Number.isFinite(fecha) && Date.now() - fecha < DURACION_NUEVO_CATALOGO_MS;
}

function crearTarjetaOferta(publicidad, categoria) {
  const articulo = document.createElement("article");
  articulo.className = "tarjeta-oferta";
  articulo.dataset.publicidadId = String(publicidad.id || "");

  const plataforma = datosPlataformaPublicidad(publicidad);
  const esComunidadAnirona = categoria === "comunidad_anirona";
  const precioPublicado = String(publicidad.precio_publicado || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  const codigo = String(publicidad.codigo_cupon || "").trim();
  const enlacePrincipal = String(publicidad.enlace || "").trim();
  const enlaceMercadoLibreGuardado = String(publicidad.enlace_mercado_libre || "").trim();
  const enlaceAmazonGuardado = String(publicidad.enlace_amazon || "").trim();
  const usaSoloEnlaceLegacy = !enlaceMercadoLibreGuardado && !enlaceAmazonGuardado && enlacePrincipal;
  const enlaceMercadoLibre = enlaceMercadoLibreGuardado ||
    (usaSoloEnlaceLegacy && obtenerPlataformaPublicidad(publicidad) === "mercadolibre" ? enlacePrincipal : "");
  const enlaceAmazon = enlaceAmazonGuardado ||
    (usaSoloEnlaceLegacy && obtenerPlataformaPublicidad(publicidad) === "amazon" ? enlacePrincipal : "");
  const disponibleMercadoLibre = publicidad.disponible_mercado_libre !== false;
  const disponibleAmazon = publicidad.disponible_amazon !== false;
  const productoNuevo = esProductoNuevoVigente(publicidad);
  const productoMasVendido = publicidad.es_mas_vendido === true;

  if (esComunidadAnirona) articulo.classList.add("tarjeta-oferta-anirona");

  const accionesAnirona = `
    ${enlaceMercadoLibre ? `
      <button class="oferta-ver oferta-ver-mercado-libre" type="button" aria-label="Ver en Mercado Libre" title="Ver en Mercado Libre">
        <img class="oferta-logo-marketplace" src="img/mercado-libre-boton.png" alt="" aria-hidden="true" />
        <span class="texto-accesible">Ver en Mercado Libre</span>
      </button>
    ` : ""}
    ${enlaceAmazon ? `
      <button class="oferta-ver oferta-ver-amazon" type="button" aria-label="Ver en Amazon" title="Ver en Amazon">
        <img class="oferta-logo-marketplace" src="img/amazon-boton.png" alt="" aria-hidden="true" />
        <span class="texto-accesible">Ver en Amazon</span>
      </button>
    ` : ""}
  `;

  articulo.innerHTML = `
    <button
      class="oferta-imagen-contenedor"
      type="button"
      aria-label="${escaparHtml(`Abrir ${publicidad.titulo || "oferta"}`)}"
      title="Ver producto"
    >
      <img
        class="oferta-imagen"
        src="${escaparHtml(publicidad.imagen_url || "")}" 
        alt="${escaparHtml(publicidad.titulo || "Oferta")}" 
        loading="lazy"
      />
    </button>

    <div class="oferta-contenido">
      ${esComunidadAnirona && (productoNuevo || productoMasVendido) ? `
        <div class="etiquetas-producto-anirona">
          ${productoMasVendido ? `<span class="etiqueta-producto-mas-vendido">MÁS VENDIDO</span>` : ""}
          ${productoNuevo ? `<span class="etiqueta-producto-nuevo">✨ Nuevo</span>` : ""}
        </div>
      ` : ""}
      <h3>${escaparHtml(publicidad.titulo || "Oferta destacada")}</h3>
      ${publicidad.descripcion ? `<p class="oferta-descripcion">${escaparHtml(publicidad.descripcion)}</p>` : ""}
      ${esComunidadAnirona ? `
        <div class="disponibilidad-marketplaces" aria-label="Disponibilidad del producto">
          <span class="disponibilidad-titulo">Disponible en:</span>
          ${enlaceMercadoLibre ? `<span class="estado-marketplace"><i class="punto-disponibilidad ${disponibleMercadoLibre ? "disponible" : "no-disponible"}" aria-hidden="true"></i> Mercado Libre</span>` : ""}
          ${enlaceAmazon ? `<span class="estado-marketplace"><i class="punto-disponibilidad ${disponibleAmazon ? "disponible" : "no-disponible"}" aria-hidden="true"></i> Amazon</span>` : ""}
        </div>
      ` : ""}

      ${!esComunidadAnirona ? `
        <div class="oferta-precios ${precioCupon ? "con-cupon" : ""}">
          ${precioPublicado ? `<div><span>Precio publicado</span><strong>${escaparHtml(precioPublicado)}</strong></div>` : ""}
          ${precioCupon ? `<div class="precio-destacado"><span>Precio con cupón</span><strong>${escaparHtml(precioCupon)}</strong></div>` : ""}
        </div>

        ${codigo ? `<p class="oferta-cupon">ℹ️ Al dar clic en <strong>${`Ver en ${plataforma.nombre}`}</strong>, el cupón se copiará automáticamente.</p>` : ""}
      ` : ""}

      <div class="oferta-meta">
        <span class="oferta-visitas" data-visitas-id="${Number(publicidad.id) || 0}">👁️ ${Number(publicidad.visitas) || 0} visitas</span>
      </div>

      <div class="oferta-acciones ${esComunidadAnirona ? `oferta-acciones-anirona${enlaceMercadoLibre && enlaceAmazon ? " ambos-marketplaces" : ""}` : ""}">
        ${esComunidadAnirona ? accionesAnirona : `<button class="oferta-ver" type="button">${plataforma.textoBoton}</button>`}
        <button class="boton-compartir oferta-compartir" type="button" aria-label="Compartir oferta" title="Compartir">
          ${iconoCompartir()}
        </button>
      </div>
      <p class="oferta-mensaje" aria-live="polite"></p>
    </div>
  `;

  const mensaje = articulo.querySelector(".oferta-mensaje");
  const botonImagen = articulo.querySelector(".oferta-imagen-contenedor");

  const abrirEnlace = (enlace, plataformaDestino) => {
    if (!enlace) return;
    abrirPublicidad({
      ...publicidad,
      enlace,
      plataforma: plataformaDestino,
      codigo_cupon: esComunidadAnirona ? "" : publicidad.codigo_cupon,
    });
  };

  if (esComunidadAnirona) {
    articulo.querySelector(".oferta-ver-mercado-libre")?.addEventListener("click", () => {
      abrirEnlace(enlaceMercadoLibre, "mercadolibre");
    });
    articulo.querySelector(".oferta-ver-amazon")?.addEventListener("click", () => {
      abrirEnlace(enlaceAmazon, "amazon");
    });
    botonImagen.addEventListener("click", () => {
      abrirEnlace(enlaceMercadoLibre || enlaceAmazon, enlaceMercadoLibre ? "mercadolibre" : "amazon");
    });
  } else {
    const botonVer = articulo.querySelector(".oferta-ver");
    const abrirOferta = () => abrirPublicidad(publicidad);
    botonVer?.addEventListener("click", abrirOferta);
    botonImagen.addEventListener("click", abrirOferta);
  }

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
  articulo.className = "tarjeta-canal-anirona tarjeta-canal-anirona-simple";

  articulo.innerHTML = `
    <a
      class="canal-anirona-boton canal-anirona-boton-ancho"
      href="https://whatsapp.com/channel/0029VbCDDC0CRs1k2wM02q1i"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Seguir canal de Anirona en WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M19.11 17.54c-.23-.12-1.37-.68-1.58-.75-.21-.08-.37-.12-.52.12-.15.23-.6.75-.73.9-.14.15-.27.17-.5.06-.23-.12-.98-.36-1.87-1.16-.69-.62-1.16-1.38-1.3-1.61-.13-.23-.01-.36.1-.47.1-.1.23-.27.35-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.26-.72-1.72-.19-.46-.38-.39-.52-.4h-.44c-.15 0-.4.06-.61.29-.21.23-.81.79-.81 1.93s.83 2.24.94 2.4c.12.15 1.63 2.49 3.95 3.49.55.24.98.38 1.32.49.55.18 1.05.15 1.45.09.44-.07 1.37-.56 1.56-1.1.19-.54.19-1 .13-1.1-.06-.09-.21-.15-.44-.27Z"/>
        <path d="M16.04 3C8.85 3 3 8.84 3 16.03c0 2.3.6 4.55 1.74 6.53L3 29l6.63-1.74a13 13 0 0 0 6.4 1.63h.01C23.22 28.89 29 23.05 29 15.86 29 8.68 23.22 3 16.04 3Zm0 23.55h-.01a10.66 10.66 0 0 1-5.44-1.49l-.39-.23-3.93 1.03 1.05-3.83-.25-.39a10.64 10.64 0 1 1 8.97 4.91Z"/>
      </svg>
      <span>Seguir canal de Anirona en WhatsApp</span>
      <span class="canal-anirona-boton-flecha" aria-hidden="true">→</span>
    </a>
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


function normalizarTextoBusqueda(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function esPublicidadTop(publicidad) {
  return Boolean(
    publicidad?.top === true ||
    publicidad?.es_top === true ||
    publicidad?.destacado === true ||
    String(publicidad?.etiqueta || "").toLowerCase() === "top"
  );
}

function fechaPublicidad(publicidad) {
  const fecha = publicidad?.fecha_publicacion || publicidad?.created_at || publicidad?.fecha_creacion;
  const tiempo = fecha ? new Date(fecha).getTime() : Number(publicidad?.id) || 0;
  return Number.isFinite(tiempo) ? tiempo : 0;
}

function ordenarCatalogoAnirona(items) {
  return [...items].sort((a, b) => {
    const diferenciaNuevo = Number(esProductoNuevoVigente(b)) - Number(esProductoNuevoVigente(a));
    if (diferenciaNuevo) return diferenciaNuevo;

    const diferenciaVisitas = (Number(b?.visitas) || 0) - (Number(a?.visitas) || 0);
    if (diferenciaVisitas) return diferenciaVisitas;

    return fechaPublicidad(b) - fechaPublicidad(a);
  });
}

function actualizarResumenCatalogoAnirona(mostrados, total, consulta = "") {
  if (!resultadosCatalogoAnirona) return;

  if (consulta) {
    resultadosCatalogoAnirona.textContent = mostrados === 1
      ? "1 producto encontrado"
      : `${mostrados} productos encontrados`;
  } else {
    resultadosCatalogoAnirona.textContent = total === 1
      ? "1 producto en el catálogo"
      : `${total} productos en el catálogo · nuevos primero y después por popularidad`;
  }
}

function renderizarCatalogoAnirona() {
  if (!ofertasComunidadAnirona) return;

  const todos = todasLasPublicidades.filter((item) =>
    publicidadPerteneceASeccion(item, "comunidad_anirona")
  );
  const consulta = normalizarTextoBusqueda(buscarCatalogoAnirona?.value || "");
  const coincideBusqueda = (item) => !consulta || normalizarTextoBusqueda([
    item?.titulo,
    item?.descripcion,
    item?.modelo,
  ].filter(Boolean).join(" ")).includes(consulta);

  const catalogoAnirona = ordenarCatalogoAnirona(
    todos.filter((item) => item?.es_otra_recomendacion !== true && coincideBusqueda(item))
  );
  const otrasRecomendaciones = ordenarCatalogoAnirona(
    todos.filter((item) => item?.es_otra_recomendacion === true && coincideBusqueda(item))
  );
  const totalMostrados = catalogoAnirona.length + otrasRecomendaciones.length;

  ofertasComunidadAnirona.replaceChildren();

  if (!totalMostrados) {
    const mensaje = document.createElement("div");
    mensaje.className = "sin-ofertas-categoria sin-resultados-busqueda";
    mensaje.innerHTML = consulta
      ? `<div aria-hidden="true">🔎</div><h3>No encontramos coincidencias</h3><p>Prueba con otra palabra, modelo o característica.</p>`
      : `<div aria-hidden="true">🛍️</div><h3>No hay productos disponibles</h3><p>Pronto agregaremos nuevos productos en esta sección.</p>`;
    ofertasComunidadAnirona.appendChild(mensaje);
  } else {
    catalogoAnirona.forEach((item) => {
      ofertasComunidadAnirona.appendChild(crearTarjetaOferta(item, "comunidad_anirona"));
    });

    if (otrasRecomendaciones.length) {
      const separador = document.createElement("div");
      separador.className = "separador-otras-recomendaciones";
      separador.innerHTML = `<h2>OTRAS RECOMENDACIONES</h2>`;
      ofertasComunidadAnirona.appendChild(separador);

      otrasRecomendaciones.forEach((item) => {
        const tarjeta = crearTarjetaOferta(item, "comunidad_anirona");
        tarjeta.classList.add("tarjeta-otra-recomendacion");
        ofertasComunidadAnirona.appendChild(tarjeta);
      });
    }
  }

  ofertasComunidadAnirona.appendChild(crearTarjetaCanalAnirona());
  actualizarResumenCatalogoAnirona(totalMostrados, todos.length, consulta);

  if (limpiarBusquedaAnirona) limpiarBusquedaAnirona.hidden = !consulta;
}

function renderizarModuloOfertas(categoria, contenedor, seccion) {
  if (categoria === "comunidad_anirona") {
    renderizarCatalogoAnirona();
    return;
  }

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

}

const DURACION_VISITA_PRODUCTO_MS = 24 * 60 * 60 * 1000;

function claveVisitaPublicidad(id, plataforma = "general") {
  const destino = plataforma === "amazon" ? "amazon" : plataforma === "mercadolibre" ? "mercadolibre" : "general";
  return `visita-publicidad-${id}-${destino}`;
}

function visitaPublicidadVigente(id, plataforma) {
  const clave = claveVisitaPublicidad(id, plataforma);
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

async function registrarVisitaPublicidad(publicidad, plataforma = "general") {
  const id = Number(publicidad?.id);
  if (!Number.isInteger(id) || id <= 0) return;

  const destino = plataforma === "amazon" ? "amazon" : plataforma === "mercadolibre" ? "mercadolibre" : "general";
  if (visitaPublicidadVigente(id, destino)) return;

  const clave = claveVisitaPublicidad(id, destino);
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
    publicidad.visitas_mercado_libre = Number(datos.visitas_mercado_libre) || 0;
    publicidad.visitas_amazon = Number(datos.visitas_amazon) || 0;
    actualizarVisitasEnPantalla(id, publicidad.visitas);
  } catch (error) {
    localStorage.removeItem(clave);
    console.warn("No fue posible registrar la visita del producto.", error);
  }
}


buscarCatalogoAnirona?.addEventListener("input", () => {
  renderizarCatalogoAnirona();
});

limpiarBusquedaAnirona?.addEventListener("click", () => {
  if (!buscarCatalogoAnirona) return;
  buscarCatalogoAnirona.value = "";
  buscarCatalogoAnirona.focus();
  renderizarCatalogoAnirona();
});

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
    revisarAvisosNovedades();

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

    cambiarVista(vistaActiva, {
      moverAlInicio: false,
      desplazamiento: "auto",
    });
    procesarNovedadDesdeUrl();

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
    cambiarVista(vistaActiva, {
      moverAlInicio: false,
      desplazamiento: "auto",
    });
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
  const titulo = String(publicidad?.titulo || "Producto Anirona").trim();
  const enlacePrincipal = String(publicidad?.enlace || "").trim();
  const plataformaPrincipal = obtenerPlataformaPublicidad(publicidad);
  const enlaceMercadoLibreGuardado = String(publicidad?.enlace_mercado_libre || "").trim();
  const enlaceAmazonGuardado = String(publicidad?.enlace_amazon || "").trim();
  const usaSoloEnlaceLegacy = !enlaceMercadoLibreGuardado && !enlaceAmazonGuardado && enlacePrincipal;
  const enlaceMercadoLibre = enlaceMercadoLibreGuardado ||
    (usaSoloEnlaceLegacy && plataformaPrincipal === "mercadolibre" ? enlacePrincipal : "");
  const enlaceAmazon = enlaceAmazonGuardado ||
    (usaSoloEnlaceLegacy && plataformaPrincipal === "amazon" ? enlacePrincipal : "");

  const lineas = [titulo];
  if (enlaceMercadoLibre) {
    lineas.push(`Enlace Mercado Libre: ${enlaceMercadoLibre}`);
  }
  if (enlaceAmazon) {
    lineas.push(`Enlace Amazon: ${enlaceAmazon}`);
  }
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
        await navigator.share({ title: publicidad.titulo || "Oferta", text: texto });
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

async function abrirPublicidad(publicidad, { copiarCuponAsignado = true } = {}) {
  const enlace = String(publicidad.enlace || "").trim();
  if (!enlace) return;
  const codigo = String(publicidad.codigo_cupon || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  try {
    if (copiarCuponAsignado && codigo) await copiarTexto(codigo);
    registrarVisitaPublicidad(publicidad, publicidad.plataforma);
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



/* ================= AVISOS DE NOVEDADES V77.5 ================= */
const CLAVE_AVISOS_ACTIVOS = "oi-avisos-novedades-activos";
const CLAVE_ULTIMO_CUPON = "oi-avisos-ultimo-cupon";
const CLAVE_ULTIMO_ANIRONA = "oi-avisos-ultimo-anirona";
let avisosNovedadesInicializados = false;
let avisoNovedadesToastTimer = null;
let sondeoNovedadesEnCurso = false;
const MILISEGUNDOS_SONDEO_NOVEDADES = 10000;
let registroServiceWorkerAvisos = null;

function maxId(items) {
  return items.reduce((maximo, item) => {
    const id = Number(item?.id) || 0;
    return Math.max(maximo, id);
  }, 0);
}

function cuponesNotificables() {
  return todosLosCupones.filter((cupon) => {
    if (cupon?.activo === false) return false;
    try {
      return couponTimeState(cupon).state !== "finalizado";
    } catch {
      return true;
    }
  });
}

function productosAnironaNotificables() {
  return todasLasPublicidades.filter(
    (publicidad) =>
      publicidad?.activo !== false &&
      publicidadPerteneceASeccion(publicidad, "comunidad_anirona")
  );
}

function crearControlesAvisosNovedades() {
  if (document.querySelector("#boton-avisos-novedades")) return;

  const contenedor = document.querySelector(".hero-redes-botones");
  if (!contenedor) return;

  const boton = document.createElement("button");
  boton.id = "boton-avisos-novedades";
  boton.type = "button";
  boton.className = "boton-avisos-novedades";
  boton.innerHTML = "<span aria-hidden=\"true\">🔔</span><span>Activar avisos</span>";
  contenedor.appendChild(boton);

  const toast = document.createElement("aside");
  toast.id = "aviso-novedades-toast";
  toast.className = "aviso-novedades-toast";
  toast.hidden = true;
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  boton.addEventListener("click", activarAvisosNovedades);
  actualizarBotonAvisosNovedades();
}

function avisosNovedadesActivos() {
  return localStorage.getItem(CLAVE_AVISOS_ACTIVOS) === "1";
}

function actualizarBotonAvisosNovedades() {
  const boton = document.querySelector("#boton-avisos-novedades");
  if (!boton) return;
  const activos = avisosNovedadesActivos();
  boton.classList.toggle("activo", activos);
  boton.querySelector("span:last-child").textContent = activos
    ? "Avisos activados"
    : "Activar avisos";
  boton.title = activos
    ? "Recibirás avisos al detectar nuevos cupones o productos"
    : "Activa avisos de nuevos cupones y productos Anirona";
}

function guardarReferenciaActualAvisos() {
  localStorage.setItem(CLAVE_ULTIMO_CUPON, String(maxId(cuponesNotificables())));
  localStorage.setItem(CLAVE_ULTIMO_ANIRONA, String(maxId(productosAnironaNotificables())));
}

async function registrarServiceWorkerAvisos() {
  if (!("serviceWorker" in navigator)) return null;
  if (registroServiceWorkerAvisos) return registroServiceWorkerAvisos;

  try {
    registroServiceWorkerAvisos = await navigator.serviceWorker.register(
      "/sw-notificaciones.js?v=77.10.0",
      { scope: "/" }
    );
    return registroServiceWorkerAvisos;
  } catch (error) {
    console.warn("No fue posible registrar el servicio de avisos.", error);
    return null;
  }
}

async function activarAvisosNovedades() {
  if (avisosNovedadesActivos()) {
    localStorage.removeItem(CLAVE_AVISOS_ACTIVOS);
    actualizarBotonAvisosNovedades();
    mostrarToastNovedades({
      titulo: "Avisos desactivados",
      mensaje: "Puedes volver a activarlos cuando quieras.",
    });
    return;
  }

  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch (error) {
      console.warn("No fue posible solicitar permiso de notificaciones.", error);
    }
  }

  await registrarServiceWorkerAvisos();
  localStorage.setItem(CLAVE_AVISOS_ACTIVOS, "1");
  guardarReferenciaActualAvisos();
  actualizarBotonAvisosNovedades();
  mostrarToastNovedades({
    titulo: "Avisos activados",
    mensaje: "Revisaremos automáticamente cada 10 segundos y mostraremos una notificación cuando el navegador lo permita.",
  });
}

function crearDestinoNovedad(tipo, item) {
  if (!item?.id) return null;
  if (tipo === "cupon") {
    return {
      tipo: "cupon",
      id: Number(item.id),
      categoria: normalizarCategoria(item),
      etiqueta: "Ver nuevo cupón",
    };
  }
  return {
    tipo: "producto",
    id: Number(item.id),
    seccion: "comunidad_anirona",
    etiqueta: "Ver nuevo producto",
  };
}

function urlDestinoNovedad(destino) {
  const url = new URL(window.location.href);
  url.searchParams.set("seccion", destino.tipo === "cupon" ? destino.categoria : "comunidad_anirona");
  url.searchParams.set("novedad_tipo", destino.tipo);
  url.searchParams.set("novedad_id", String(destino.id));
  if (destino.categoria) url.searchParams.set("novedad_categoria", destino.categoria);
  else url.searchParams.delete("novedad_categoria");
  return url.toString();
}

function limpiarParametrosNovedad() {
  const url = new URL(window.location.href);
  url.searchParams.delete("novedad_tipo");
  url.searchParams.delete("novedad_id");
  url.searchParams.delete("novedad_categoria");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

async function esperarElementoNovedad(selector, intentos = 35) {
  for (let intento = 0; intento < intentos; intento += 1) {
    const elemento = document.querySelector(selector);
    if (elemento) return elemento;
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  }
  return null;
}

async function irANovedad(destino, { limpiarUrl = false } = {}) {
  if (!destino?.id || !destino?.tipo) return false;

  let selector = "";
  if (destino.tipo === "cupon") {
    cambiarCategoria(destino.categoria || "tienda", {
      actualizarHistorial: false,
      desplazamiento: "auto",
    });
    selector = `.cupon[data-id="${CSS.escape(String(destino.id))}"]`;
  } else {
    if (buscarCatalogoAnirona) buscarCatalogoAnirona.value = "";
    cambiarVista("comunidad_anirona", {
      actualizarHistorial: false,
      desplazamiento: "auto",
      moverAlInicio: false,
    });
    renderizarCatalogoAnirona();
    selector = `.tarjeta-oferta[data-publicidad-id="${CSS.escape(String(destino.id))}"]`;
  }

  const elemento = await esperarElementoNovedad(selector);
  if (!elemento) return false;

  elemento.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  window.setTimeout(() => {
    elemento.classList.remove("novedad-resaltada");
    void elemento.offsetWidth;
    elemento.classList.add("novedad-resaltada");
    window.setTimeout(() => elemento.classList.remove("novedad-resaltada"), 4800);
  }, 450);

  if (limpiarUrl) limpiarParametrosNovedad();
  return true;
}

function obtenerNovedadDesdeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const tipo = parametros.get("novedad_tipo");
  const id = Number(parametros.get("novedad_id") || 0);
  if (!id || !["cupon", "producto"].includes(tipo)) return null;
  return {
    tipo,
    id,
    categoria: parametros.get("novedad_categoria") || "tienda",
  };
}

let procesandoNovedadUrl = false;
async function procesarNovedadDesdeUrl() {
  if (procesandoNovedadUrl) return;
  const destino = obtenerNovedadDesdeUrl();
  if (!destino) return;
  procesandoNovedadUrl = true;
  try {
    await irANovedad(destino, { limpiarUrl: true });
  } finally {
    procesandoNovedadUrl = false;
  }
}

function mostrarToastNovedades({ titulo, mensaje, seccion = "", acciones = [] }) {
  const toast = document.querySelector("#aviso-novedades-toast");
  if (!toast) return;

  const accionesNormalizadas = acciones.length
    ? acciones.filter((accion) => accion?.destino)
    : seccion
      ? [{
          etiqueta: "Ver ahora",
          destino: seccion === "cupones"
            ? { tipo: "cupon", id: maxId(cuponesNotificables()), categoria: "tienda" }
            : { tipo: "producto", id: maxId(productosAnironaNotificables()), seccion },
        }]
      : [];

  window.clearTimeout(avisoNovedadesToastTimer);
  toast.innerHTML = `
    <strong>${titulo}</strong>
    <p>${mensaje}</p>
    <div class="aviso-novedades-toast-acciones">
      ${accionesNormalizadas.map((accion, indice) => `<button class="aviso-novedades-ver" type="button" data-accion-indice="${indice}">${accion.etiqueta || "Ver ahora"}</button>`).join("")}
      <button class="aviso-novedades-cerrar" type="button">Cerrar</button>
    </div>
  `;
  toast.hidden = false;

  toast.querySelector(".aviso-novedades-cerrar")?.addEventListener("click", () => {
    toast.hidden = true;
  });
  toast.querySelectorAll(".aviso-novedades-ver").forEach((boton) => {
    boton.addEventListener("click", async () => {
      const accion = accionesNormalizadas[Number(boton.dataset.accionIndice) || 0];
      toast.hidden = true;
      if (accion?.destino) await irANovedad(accion.destino);
    });
  });

  avisoNovedadesToastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 14000);
}

async function lanzarNotificacionNavegador(titulo, cuerpo, destino = null) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const opciones = {
    body: cuerpo,
    icon: "/img/logo.png",
    badge: "/img/logo.png",
    tag: "ofertas-imperdibles-novedades",
    renotify: true,
    data: { url: destino ? urlDestinoNovedad(destino) : window.location.href },
  };

  try {
    const registro = await registrarServiceWorkerAvisos();
    if (registro?.showNotification) {
      await registro.showNotification(titulo, opciones);
      return;
    }

    new Notification(titulo, opciones);
  } catch (error) {
    console.warn("No fue posible mostrar la notificación del navegador.", error);
  }
}

function revisarAvisosNovedades() {
  crearControlesAvisosNovedades();
  if (!todosLosCupones.length && !todasLasPublicidades.length) return;

  const cuponesActuales = cuponesNotificables();
  const productosActuales = productosAnironaNotificables();
  const ultimoCuponActual = maxId(cuponesActuales);
  const ultimoAnironaActual = maxId(productosActuales);
  const ultimoCuponVisto = Number(localStorage.getItem(CLAVE_ULTIMO_CUPON) || 0);
  const ultimoAnironaVisto = Number(localStorage.getItem(CLAVE_ULTIMO_ANIRONA) || 0);

  if (!avisosNovedadesInicializados) avisosNovedadesInicializados = true;

  if (!ultimoCuponVisto && ultimoCuponActual) {
    localStorage.setItem(CLAVE_ULTIMO_CUPON, String(ultimoCuponActual));
  }
  if (!ultimoAnironaVisto && ultimoAnironaActual) {
    localStorage.setItem(CLAVE_ULTIMO_ANIRONA, String(ultimoAnironaActual));
  }

  if (!avisosNovedadesActivos()) return;

  const referenciaCupon = Number(localStorage.getItem(CLAVE_ULTIMO_CUPON) || 0);
  const referenciaAnirona = Number(localStorage.getItem(CLAVE_ULTIMO_ANIRONA) || 0);
  const cuponNuevo = [...cuponesActuales]
    .filter((item) => Number(item.id) > referenciaCupon)
    .sort((a, b) => Number(b.id) - Number(a.id))[0] || null;
  const productoNuevo = [...productosActuales]
    .filter((item) => Number(item.id) > referenciaAnirona)
    .sort((a, b) => Number(b.id) - Number(a.id))[0] || null;

  if (!cuponNuevo && !productoNuevo) return;

  const destinoCupon = crearDestinoNovedad("cupon", cuponNuevo);
  const destinoProducto = crearDestinoNovedad("producto", productoNuevo);
  const acciones = [];
  if (destinoCupon) acciones.push({ etiqueta: "Ver nuevo cupón", destino: destinoCupon });
  if (destinoProducto) acciones.push({ etiqueta: "Ver nuevo producto", destino: destinoProducto });

  let titulo = "Hay novedades en Ofertas Imperdibles";
  let mensaje = "";
  if (cuponNuevo && productoNuevo) {
    mensaje = "Se agregó un nuevo cupón y un nuevo producto en Comunidad Anirona.";
  } else if (cuponNuevo) {
    titulo = "Nuevo cupón disponible";
    mensaje = "Se agregó un nuevo cupón. Revísalo antes de que termine.";
  } else {
    titulo = "Nuevo producto Anirona";
    mensaje = "Se agregó un nuevo producto al catálogo de Comunidad Anirona.";
  }

  mostrarToastNovedades({ titulo, mensaje, acciones });
  lanzarNotificacionNavegador(titulo, mensaje, destinoProducto || destinoCupon);
  localStorage.setItem(CLAVE_ULTIMO_CUPON, String(ultimoCuponActual));
  localStorage.setItem(CLAVE_ULTIMO_ANIRONA, String(ultimoAnironaActual));
}

async function sondearNovedadesAutomaticamente() {
  if (
    sondeoNovedadesEnCurso ||
    document.hidden ||
    !avisosNovedadesActivos() ||
    redireccionEnProceso ||
    !modalRedireccion.hidden
  ) {
    return;
  }

  sondeoNovedadesEnCurso = true;
  try {
    await Promise.allSettled([cargarCupones(), cargarPublicidad()]);
  } finally {
    sondeoNovedadesEnCurso = false;
  }
}

window.setInterval(sondearNovedadesAutomaticamente, MILISEGUNDOS_SONDEO_NOVEDADES);

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
    sondearNovedadesAutomaticamente();
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
crearControlesAvisosNovedades();
registrarServiceWorkerAvisos();

const urlInicialTieneSeccion =
  new URLSearchParams(window.location.search).has("seccion");

activarSeccionDesdeUrl({
  actualizarHistorial: urlInicialTieneSeccion,
  desplazamiento: "auto",
});

cargarCupones();
cargarPublicidad();


/* ================= EVENTOS Y RIFAS V68.0.1 ================= */
{
const root=document.querySelector('#eventos-comunidad');
const heroButtons=document.querySelector('.hero-redes-botones');
let currentEvent=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const dateText=v=>v?new Intl.DateTimeFormat('es-MX',{dateStyle:'long',timeStyle:'short',timeZone:'America/Mexico_City'}).format(new Date(v)):'';
const formatNo=n=>String(n||0).padStart(6,'0');
async function api(url,opt){const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No fue posible completar la operación.');return d;}
function countdown(date,el){if(!date||!el)return;const tick=()=>{const diff=new Date(date)-new Date();if(diff<=0){el.textContent='El sorteo está por realizarse';return;}const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),mins=Math.floor(diff%3600000/60000);el.textContent=`Faltan ${days} días, ${hours} h y ${mins} min`;};tick();setInterval(tick,60000);}
function winnerHero(e){document.querySelector('#hero-ganador-evento')?.remove();const w=e?.ganadores?.[0];if(!w||!heroButtons)return;const a=document.createElement('a');a.id='hero-ganador-evento';a.className='hero-ganador';a.href='#eventos-comunidad';a.innerHTML=`🏆 Ganador: <strong>${esc(formatNo(w.numero))}</strong>`;a.addEventListener('click',()=>document.querySelector('[data-vista="comunidad_anirona"]')?.click());heroButtons.append(a);}
function render(e){currentEvent=e;winnerHero(e);if(!root)return;if(!e){root.innerHTML='<div class="evento-estado-vacio"><strong>🎁 Próximamente habrá una nueva dinámica.</strong><p>Mantente pendiente de Comunidad Anirona.</p></div>';return;}const pct=Math.min(100,Math.round((e.participantes_count/e.limite_boletos)*100));const open=e.estado==='abierta'&&e.disponibles>0;const winners=(e.ganadores||[]).map(w=>`<div class="evento-ganador"><span>🏆 Ganador${w.posicion>1?' '+w.posicion:''}</span><strong>${formatNo(w.numero)}</strong><span>${esc(w.nombre_parcial)}</span></div>`).join('');root.innerHTML=`<article class="evento-card"><div class="evento-portada">${e.imagen_url?`<img class="evento-imagen" src="${esc(e.imagen_url)}" alt="${esc(e.producto_nombre)}">`:'<div class="evento-imagen"></div>'}<div class="evento-info"><span class="evento-etiqueta">${esc(e.tipo)}</span><h3>${esc(e.nombre)}</h3><p class="evento-producto">🎁 ${esc(e.producto_nombre)}</p>${e.premio_enlace?`<div class="evento-premio-enlace"><span><strong>🏆 Premio</strong><small>${esc(e.premio_plataforma||'Ver producto')}</small></span><a id="evento-premio-btn" class="evento-boton evento-premio-boton" href="${esc(e.premio_enlace)}" target="_blank" rel="noopener noreferrer" data-cupon="${esc(e.premio_cupon||'')}">🛒 Conocer el premio</a></div>`:''}<p class="evento-descripcion">${esc(e.descripcion)}</p>${e.fecha_sorteo?`<p class="evento-fecha">📅 Sorteo: ${esc(dateText(e.fecha_sorteo))}</p><p id="evento-cuenta" class="evento-cuenta"></p>`:''}${e.mostrar_contador?`<div class="evento-progreso"><div class="evento-progreso-texto"><strong>${e.participantes_count} participantes</strong><span>${e.disponibles} disponibles</span></div><div class="evento-progreso-barra"><span style="width:${pct}%"></span></div></div>`:''}${winners}${open?`<form id="evento-form" class="evento-form-grid"><div class="evento-campo evento-campo-completo"><label>Nombre completo</label><input name="nombre" required maxlength="100" autocomplete="name"></div><div class="evento-campo"><label>Teléfono</label><input name="telefono" required inputmode="numeric" maxlength="14" autocomplete="tel"></div><div class="evento-campo"><label>Ciudad (opcional)</label><input name="ciudad" maxlength="80" autocomplete="address-level2"></div><label class="evento-privacidad evento-campo-completo"><input name="privacidad" type="checkbox" required> <span>Acepto que mis datos se utilicen únicamente para administrar esta dinámica y contactar a las personas ganadoras.</span></label><button class="evento-boton evento-campo-completo" type="submit">Registrarme y obtener mi número</button><p id="evento-mensaje" class="evento-mensaje evento-campo-completo" aria-live="polite"></p></form>`:`<div class="evento-resultado"><strong>${e.estado==='finalizada'?'Esta dinámica ha finalizado.':'Los registros están cerrados.'}</strong></div>`}<div class="evento-consulta"><strong>Consultar mi registro</strong><div class="evento-consulta-fila evento-campo"><input id="evento-consulta-tel" inputmode="numeric" maxlength="14" placeholder="Teléfono de 10 dígitos"><button id="evento-consulta-btn" class="evento-boton evento-secundario" type="button">Buscar</button></div><p id="evento-consulta-msg" class="evento-mensaje"></p></div></div></div></article>`;countdown(e.fecha_sorteo,document.querySelector('#evento-cuenta'));document.querySelector('#evento-form')?.addEventListener('submit',register);document.querySelector('#evento-consulta-btn')?.addEventListener('click',lookup);document.querySelector('#evento-premio-btn')?.addEventListener('click',ev=>{const cup=ev.currentTarget.dataset.cupon;if(cup&&navigator.clipboard){navigator.clipboard.writeText(cup).then(()=>{const original=ev.currentTarget.textContent;ev.currentTarget.textContent=`✓ Cupón ${cup} copiado`;setTimeout(()=>ev.currentTarget.textContent=original,2200)}).catch(()=>{});}});}
function resultHtml(p){const share=`🎉 Ya estoy participando en ${currentEvent.nombre}. Mi número es ${formatNo(p.numero)} (${p.codigo}).`;return `<div id="evento-comprobante-print" class="evento-resultado"><strong>✅ ¡Registro exitoso!</strong><span>Tu número de participante es</span><span class="evento-numero">${formatNo(p.numero)}</span><span class="evento-codigo">${esc(p.codigo)}</span><img alt="Código QR del participante" width="150" height="150" src="https://quickchart.io/qr?size=180&text=${encodeURIComponent(p.codigo)}"><div class="evento-acciones"><a class="evento-boton" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(share)}">Compartir por WhatsApp</a><button class="evento-boton evento-secundario" onclick="window.print()" type="button">Guardar comprobante</button></div></div>`;}
async function register(ev){ev.preventDefault();const f=ev.currentTarget,m=f.querySelector('#evento-mensaje'),btn=f.querySelector('button');m.textContent='Registrando…';m.classList.remove('error');btn.disabled=true;try{const fd=new FormData(f);const p=await api('/api/cupones?action=eventos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({evento_id:currentEvent.id,nombre:fd.get('nombre'),telefono:fd.get('telefono'),ciudad:fd.get('ciudad'),acepta_privacidad:fd.get('privacidad')==='on'})});f.outerHTML=resultHtml(p);}catch(e){m.textContent=e.message;m.classList.add('error');btn.disabled=false;}}
async function lookup(){const input=document.querySelector('#evento-consulta-tel'),msg=document.querySelector('#evento-consulta-msg');msg.textContent='Buscando…';msg.classList.remove('error');try{const p=await api(`/api/cupones?action=eventos-consulta&evento_id=${currentEvent.id}&telefono=${encodeURIComponent(input.value)}`);msg.innerHTML=`✅ ${esc(p.nombre)} · Número <strong>${formatNo(p.numero)}</strong> · ${esc(p.codigo)}`;}catch(e){msg.textContent=e.message;msg.classList.add('error');}}
async function load(){try{const d=await api('/api/cupones?action=eventos');render(d.evento);}catch(e){if(root)root.innerHTML=`<div class="evento-estado-vacio">${esc(e.message)}</div>`;}}
load();

}


document.addEventListener("ofertas:etiquetas-cargadas", () => {
  if (vistaActiva === "cupones") renderizarCategoria();
});


/* ================= TUTORIAL DE CUPONES V77.11 LTS ================= */
const CLAVE_TUTORIAL_COMPLETADO = "oi-tutorial-cupones-v77-11-completado";
let tutorialActivo = false;
let tutorialPasoActual = 0;
let tutorialElementos = null;

const esperarTutorial = (ms = 400) => new Promise((resolve) => window.setTimeout(resolve, ms));

function crearBotonTutorial() {
  if (document.querySelector("#boton-ver-tutorial")) return;
  const contenedor = document.querySelector(".hero-redes-botones");
  if (!contenedor) return;
  const boton = document.createElement("button");
  boton.id = "boton-ver-tutorial";
  boton.type = "button";
  boton.className = "boton-ver-tutorial";
  boton.innerHTML = '<span aria-hidden="true">📖</span><span>Ver tutorial</span>';
  boton.title = "Aprende a utilizar los cupones";
  boton.addEventListener("click", () => iniciarTutorialGuiado(false));
  const botonAvisos = contenedor.querySelector("#boton-avisos-novedades");
  if (botonAvisos) botonAvisos.insertAdjacentElement("afterend", boton);
  else contenedor.appendChild(boton);
}

function crearCuponEjemploTutorial() {
  const ejemplo = document.createElement("section");
  ejemplo.id = "tutorial-cupon-ejemplo";
  ejemplo.className = "tutorial-cupon-ejemplo";
  ejemplo.hidden = true;
  ejemplo.setAttribute("aria-label", "Cupón de ejemplo para el tutorial");
  ejemplo.innerHTML = `
    <article class="cupon tutorial-cupon-demo" data-color="0">
      <div class="cupon-encabezado">
        <h2 class="descuento">10% de descuento</h2>
      </div>
      <div class="cupon-contenido">
        <div class="cupon-etiquetas"><span class="etiqueta-cupon etiqueta-nuevo">✨ Nuevo</span></div>
        <div id="tutorial-info-cupon">
          <p class="descuento-maximo">Descuento máximo de <strong>$250</strong></p>
          <p class="compra-minima">Compra mínima: $1,000</p>
        </div>
        <div class="acciones-bloque">
          <div class="acciones-cupon">
            <button id="tutorial-boton-canjear" class="boton-canjear" type="button" tabindex="-1">📋 Copiar y Canjear</button>
          </div>
          <div class="acciones-secundarias">
            <button id="tutorial-boton-like" class="boton-like" type="button" tabindex="-1" aria-label="Me gusta">${iconoMeGusta()}</button>
            <button id="tutorial-boton-compartir" class="boton-compartir" type="button" tabindex="-1" aria-label="Compartir">${iconoCompartir()}</button>
            <div class="estadisticas-cupon">
              <span class="estadistica-item estadistica-likes">${iconoMeGusta()} <span>325</span></span>
              <span class="estadistica-item estadistica-usos">${iconoCopias()} <span>1,245</span></span>
            </div>
          </div>
        </div>
      </div>
    </article>
    <p class="tutorial-ejemplo-aviso">Ejemplo visual: no copia ni canjea ningún cupón.</p>
  `;
  ejemplo.addEventListener("click", (evento) => evento.preventDefault());
  document.body.appendChild(ejemplo);
  return ejemplo;
}

function crearInterfazTutorial() {
  if (tutorialElementos) return tutorialElementos;
  const foco = document.createElement("div");
  foco.className = "tutorial-foco";
  foco.hidden = true;
  const tarjeta = document.createElement("section");
  tarjeta.className = "tutorial-tarjeta";
  tarjeta.hidden = true;
  tarjeta.setAttribute("role", "dialog");
  tarjeta.setAttribute("aria-modal", "true");
  tarjeta.setAttribute("aria-labelledby", "tutorial-titulo");
  tarjeta.innerHTML = `
    <div class="tutorial-cabecera">
      <span id="tutorial-contador" class="tutorial-contador"></span>
      <button class="tutorial-cerrar" type="button" aria-label="Cerrar tutorial">×</button>
    </div>
    <div class="tutorial-icono" aria-hidden="true">✨</div>
    <h2 id="tutorial-titulo"></h2>
    <p id="tutorial-texto"></p>
    <div class="tutorial-acciones">
      <button class="tutorial-anterior" type="button">Anterior</button>
      <button class="tutorial-siguiente" type="button">Siguiente</button>
    </div>`;
  document.body.append(foco, tarjeta);
  tutorialElementos = {
    foco,
    tarjeta,
    ejemplo: crearCuponEjemploTutorial(),
    titulo: tarjeta.querySelector("#tutorial-titulo"),
    texto: tarjeta.querySelector("#tutorial-texto"),
    contador: tarjeta.querySelector("#tutorial-contador"),
    anterior: tarjeta.querySelector(".tutorial-anterior"),
    siguiente: tarjeta.querySelector(".tutorial-siguiente"),
    cerrar: tarjeta.querySelector(".tutorial-cerrar"),
  };
  tutorialElementos.anterior.addEventListener("click", () => mostrarPasoTutorial(tutorialPasoActual - 1));
  tutorialElementos.siguiente.addEventListener("click", () => {
    if (tutorialPasoActual >= pasosTutorial.length - 1) finalizarTutorialGuiado(true, true);
    else mostrarPasoTutorial(tutorialPasoActual + 1);
  });
  tutorialElementos.cerrar.addEventListener("click", () => finalizarTutorialGuiado(true));
  window.addEventListener("resize", () => tutorialActivo && posicionarTutorial(pasosTutorial[tutorialPasoActual]));
  window.addEventListener("scroll", () => tutorialActivo && posicionarTutorial(pasosTutorial[tutorialPasoActual]), { passive: true });
  return tutorialElementos;
}

const pasosTutorial = [
  {
    titulo: "¡Bienvenido a Ofertas Imperdibles MX!",
    texto: "En menos de un minuto aprenderás a encontrar, copiar y compartir los cupones publicados.",
    icono: "👋",
    preparar: async () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    selector: "#tab-tienda",
    titulo: "Cupones de Tienda",
    texto: "Aquí encontrarás los cupones principales y generales disponibles para tus compras.",
    preparar: async () => { tabTienda?.click(); await esperarTutorial(350); },
  },
  {
    selector: "#tab-bancarios",
    titulo: "Cupones Bancarios",
    texto: "En Bancarios se muestran los descuentos exclusivos de bancos y métodos de pago participantes.",
  },
  {
    selector: "#tutorial-info-cupon",
    demo: true,
    titulo: "Información del cupón",
    texto: "Cada tarjeta indica el descuento, la compra mínima, el ahorro máximo y si el cupón es nuevo, popular o destacado.",
    icono: "🎟️",
  },
  {
    selector: "#tutorial-boton-canjear",
    demo: true,
    titulo: "Copiar y Canjear",
    texto: "Este botón copia el código y te lleva a Mercado Libre para que puedas pegarlo al momento de comprar.",
    icono: "📋",
  },
  {
    selector: "#tutorial-boton-like",
    demo: true,
    titulo: "Me gusta",
    texto: "Marca Me gusta cuando un cupón te resulte útil. Así ayudas a la comunidad a reconocer las mejores oportunidades.",
    icono: "👍",
  },
  {
    selector: "#tutorial-boton-compartir",
    demo: true,
    titulo: "Compartir",
    texto: "Envía el cupón rápidamente a familiares o amigos para que también puedan aprovecharlo.",
    icono: "🔗",
  },
  {
    selector: "#boton-avisos-novedades",
    titulo: "Activa los avisos",
    texto: "Recibe una alerta cuando publiquemos un nuevo cupón, sin tener que revisar la página constantemente.",
    icono: "🔔",
    preparar: async () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    selector: ".hero-redes-whatsapp, .hero-redes-facebook",
    titulo: "Síguenos",
    texto: "Únete a WhatsApp y Facebook para recibir promociones, novedades y recordatorios de cupones.",
    icono: "📲",
    preparar: async () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    titulo: "¡Listo para ahorrar!",
    texto: "Ya conoces las funciones principales de los cupones. Puedes repetir este recorrido cuando quieras desde Ver tutorial.",
    icono: "🎉",
    finalizarEnTienda: true,
  },
];

function obtenerObjetivoTutorial(paso) {
  return paso?.selector ? document.querySelector(paso.selector) : null;
}

function posicionarTutorial(paso) {
  if (!tutorialActivo || !tutorialElementos) return;
  const objetivo = obtenerObjetivoTutorial(paso);
  const { foco, tarjeta } = tutorialElementos;
  tarjeta.classList.toggle("tutorial-demo-activo", Boolean(paso?.demo));
  if (!objetivo) {
    foco.hidden = true;
    tarjeta.classList.add("tutorial-centrada");
    tarjeta.style.removeProperty("left");
    tarjeta.style.removeProperty("top");
    tarjeta.style.removeProperty("bottom");
    return;
  }
  const rect = objetivo.getBoundingClientRect();
  const margen = 7;
  foco.hidden = false;
  foco.style.left = `${Math.max(4, rect.left - margen)}px`;
  foco.style.top = `${Math.max(4, rect.top - margen)}px`;
  foco.style.width = `${Math.min(window.innerWidth - 8, rect.width + margen * 2)}px`;
  foco.style.height = `${Math.min(window.innerHeight - 8, rect.height + margen * 2)}px`;
  tarjeta.classList.remove("tutorial-centrada");
  const anchoTarjeta = Math.min(360, window.innerWidth - 24);
  tarjeta.style.width = `${anchoTarjeta}px`;
  if (paso?.demo) {
    tarjeta.style.left = `${Math.max(12, (window.innerWidth - anchoTarjeta) / 2)}px`;
    tarjeta.style.top = "auto";
    tarjeta.style.bottom = "12px";
    return;
  }
  tarjeta.style.removeProperty("bottom");
  const altoTarjeta = tarjeta.offsetHeight || 240;
  let left = rect.left + rect.width / 2 - anchoTarjeta / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - anchoTarjeta - 12));
  let top = rect.bottom + 14;
  if (top + altoTarjeta > window.innerHeight - 10) top = rect.top - altoTarjeta - 14;
  if (top < 10) top = Math.max(12, window.innerHeight / 2 - altoTarjeta / 2);
  tarjeta.style.left = `${left}px`;
  tarjeta.style.top = `${top}px`;
}

async function mostrarPasoTutorial(indice) {
  if (!tutorialActivo) return;
  indice = Math.max(0, Math.min(indice, pasosTutorial.length - 1));
  tutorialPasoActual = indice;
  const paso = pasosTutorial[indice];
  const ui = crearInterfazTutorial();
  ui.foco.hidden = true;
  ui.tarjeta.style.visibility = "hidden";
  ui.ejemplo.hidden = !paso.demo;
  if (typeof paso.preparar === "function") {
    try { await paso.preparar(); } catch (error) { console.warn("No fue posible preparar un paso del tutorial.", error); }
  }
  if (paso.demo) await esperarTutorial(120);
  let objetivo = obtenerObjetivoTutorial(paso);
  if (objetivo && !paso.demo) {
    objetivo.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    await esperarTutorial(450);
    objetivo = obtenerObjetivoTutorial(paso);
  }
  ui.titulo.textContent = paso.titulo;
  ui.texto.textContent = paso.texto;
  ui.tarjeta.querySelector(".tutorial-icono").textContent = paso.icono || "💡";
  ui.contador.textContent = `${indice + 1} de ${pasosTutorial.length}`;
  ui.anterior.hidden = indice === 0;
  ui.siguiente.textContent = indice === pasosTutorial.length - 1 ? "Ir a los cupones" : "Siguiente";
  ui.tarjeta.hidden = false;
  ui.tarjeta.style.visibility = "visible";
  posicionarTutorial(paso);
}

function iniciarTutorialGuiado(automatico = false) {
  if (tutorialActivo) return;
  tutorialActivo = true;
  tutorialPasoActual = 0;
  document.documentElement.classList.add("tutorial-en-curso");
  crearInterfazTutorial();
  mostrarPasoTutorial(0);
  if (!automatico) localStorage.setItem(CLAVE_TUTORIAL_COMPLETADO, "1");
}

function finalizarTutorialGuiado(completado = false, irATienda = false) {
  tutorialActivo = false;
  document.documentElement.classList.remove("tutorial-en-curso");
  if (tutorialElementos) {
    tutorialElementos.foco.hidden = true;
    tutorialElementos.tarjeta.hidden = true;
    tutorialElementos.ejemplo.hidden = true;
  }
  if (completado) localStorage.setItem(CLAVE_TUTORIAL_COMPLETADO, "1");
  if (irATienda) {
    tabTienda?.click();
    window.setTimeout(() => document.querySelector("#contenedor-cupones, .contenedor-cupones")?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  }
}

crearBotonTutorial();
window.setTimeout(() => {
  crearBotonTutorial();
  if (!localStorage.getItem(CLAVE_TUTORIAL_COMPLETADO)) iniciarTutorialGuiado(true);
}, 1800);

