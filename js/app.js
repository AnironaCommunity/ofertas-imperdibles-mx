const cuponesContainer = document.querySelector("#cupones");
const todosWrapper = document.querySelector("#todos-wrapper");
const sinCupones = document.querySelector("#sin-cupones");
const bannersCupones = document.querySelector("#banners-cupones");
const bannersCuponesLista = document.querySelector("#banners-cupones-lista");
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
const modalCodigo = document.querySelector("#modal-codigo");
const modalCodigoBloque = document.querySelector("#modal-codigo-bloque");
const modalCuponOculto = document.querySelector("#modal-cupon-oculto");
const modalContinuar = document.querySelector("#modal-continuar");
const modalCancelar = document.querySelector("#modal-cancelar");


const tabTodos = document.querySelector("#tab-todos");
const tabTienda = document.querySelector("#tab-tienda");
const tabBancarios = document.querySelector("#tab-bancarios");
const tabExclusivo = document.querySelector("#tab-exclusivo");
const vistaCupones = document.querySelector("#vista-cupones");
const botonesMenuOfertas = document.querySelectorAll(".menu-ofertas [data-vista]");
const botonComunidadAnirona = document.querySelector("#boton-anirona-hero[data-vista]");
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
const contadorCuponesExclusivo = document.querySelector(
  "#contador-cupones-exclusivo"
);
const selectorCupones = document.querySelector(
  ".selector-cupones-menu.selector-cupones-oscuro"
);
const resumenCuponesDisponibles = document.querySelector("#resumen-cupones-disponibles");
const recordatorioCuponesAgotados = document.querySelector("#recordatorio-cupones-agotados");
const resumenVisitas = document.querySelector("#resumen-visitas");
const resumenCopiados = document.querySelector("#resumen-copiados");

/* V81.67 — Buscador inteligente de cupones por monto */
const buscadorCuponesForm = document.querySelector("#buscador-cupones-form");
const buscadorCuponesMonto = document.querySelector("#buscador-cupones-monto");
const buscadorCuponesResultado = document.querySelector("#buscador-cupones-resultado");
const buscadorCuponesFiltros = Array.from(document.querySelectorAll("[data-buscador-filtro]"));
const buscadorCuponesFiltrosContenedor = document.querySelector(".buscador-cupones-filtros");
let filtroBuscadorCupones = "todos";
let indiceAlternativaBuscador = 0;
let temporizadorRegresoCuponPrincipal = null;
let mantenerAlternativaHasta = 0;
const TIEMPO_REGRESO_CUPON_PRINCIPAL = 12000; // V81.79: 12 s para permitir leer la alternativa.
const buscadorCuponesSeccion = document.querySelector(".buscador-cupones");
let posicionAntesBuscador = null;
let ajusteTecladoProgramado = null;



const carruselesPublicidad = [];
const seccionComunidadAnirona = document.querySelector("#seccion-comunidad-anirona");
const botonRegresarCuponesAnirona = document.querySelector("#boton-regresar-cupones-anirona");
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
  programarSincronizacionAlturaTarjetas({ incluirSegundoPase: true });
});

const SEGUNDOS_ACTUALIZACION = 5;
const MILISEGUNDOS_PUBLICIDAD = 8000;
const URL_PAGINA = "https://ofertasimperdiblesmx.vercel.app/";
const COLORES = ["turquesa", "azul", "morado", "coral", "oliva"];

let segundosRestantes = SEGUNDOS_ACTUALIZACION;
let cargando = false;
let redireccionEnProceso = false;
let temporizadorRedireccion = null;
const SEGUNDOS_REDIRECCION_AUTOMATICA = 5;
let categoriaActiva = "todos";
let vistaActiva = "cupones";
let todosLosCupones = [];
let firmaUltimosCupones = "";
let todasLasPublicidades = [];
let temporizadorEstados = null;
let temporizadorPrioridadNuevo = null;

const SECCIONES_URL = {
  todos: {
    vista: "cupones",
    categoria: "todos",
  },
  tienda: {
    vista: "cupones",
    categoria: "tienda",
  },
  bancarios: {
    vista: "cupones",
    categoria: "bancarios",
  },
  exclusivo: {
    vista: "cupones",
    categoria: "exclusivo",
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
  todos: "Cupones de Mercado Libre | Ofertas Imperdibles MX",
  tienda: "Cupones Tienda | Ofertas Imperdibles MX",
  bancarios: "Cupones Bancarios | Ofertas Imperdibles MX",
  exclusivo: "Cupones Exclusivos | Ofertas Imperdibles MX",
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

function actualizarResumenCupones() {
  const disponibles = todosLosCupones.filter((cupon) =>
    cupon?.activo !== false && couponTimeState(cupon).state !== "finalizado"
  );
  const copiados = disponibles.reduce((total, cupon) => total + Math.max(0, Number(cupon?.clics) || 0), 0);
  if (resumenCuponesDisponibles) resumenCuponesDisponibles.textContent = disponibles.length.toLocaleString("es-MX");
  if (resumenCopiados) resumenCopiados.textContent = copiados.toLocaleString("es-MX");
}

async function cargarVisitasResumen() {
  if (!resumenVisitas) return;
  try {
    const respuesta = await fetch("/api/cupones?action=visitantes", { cache: "no-store" });
    if (!respuesta.ok) return;
    const datos = await respuesta.json();
    resumenVisitas.textContent = Math.max(0, Number(datos?.total_visitas) || 0).toLocaleString("es-MX");
  } catch {}
}

function actualizarContadoresSecciones() {
  actualizarResumenCupones();
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
  const cantidadExclusivos = todosLosCupones.filter(
    (cupon) =>
      cupon.activo !== false &&
      normalizarCategoria(cupon) === "exclusivo" &&
      couponTimeState(cupon).state !== "finalizado"
  ).length;

  mostrarCantidadSeccion(
    contadorCuponesBancarios,
    cantidadBancarios,
    "cupón"
  );
  mostrarCantidadSeccion(
    contadorCuponesExclusivo,
    cantidadExclusivos,
    "cupón"
  );

  const hayExclusivos = cantidadExclusivos > 0;
  if (tabExclusivo) tabExclusivo.hidden = !hayExclusivos;
  if (selectorCupones) {
    selectorCupones.style.setProperty(
      "--selector-columnas",
      hayExclusivos ? "4" : "3"
    );
  }

  // Si el usuario conserva una URL de Exclusivos cuando ya no hay cupones,
  // volvemos a Todos para evitar una vista vacía con el botón oculto.
  if (!hayExclusivos && categoriaActiva === "exclusivo") {
    categoriaActiva = "todos";
    actualizarUrlSeccion("todos", "replace");
    renderizarCategoria();
  }
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
  const sorteo = String(parametros.get("sorteo") || "").toLowerCase().trim();
  const seccion = String(parametros.get("seccion") || "").toLowerCase().trim();

  if (sorteo === "registro") return "anirona";
  // La URL principal sin parámetros corresponde a Todos.
  return SECCIONES_URL[seccion] ? seccion : "todos";
}

function actualizarUrlSeccion(seccion, modo = "push") {
  if (!SECCIONES_URL[seccion]) return;

  const url = new URL(window.location.href);

  // "Todos" usa la URL principal que ya se comparte públicamente.
  if (seccion === "todos") {
    url.searchParams.delete("seccion");
  } else {
    url.searchParams.set("seccion", seccion);
  }
  // Al navegar normalmente, retirar el acceso temporal al registro del sorteo.
  url.searchParams.delete("sorteo");
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

botonRecargar?.addEventListener("click", cargarCupones);
function actualizarNavegacionPrincipal(seccion) {
  const mapa = {
    todos: tabTodos,
    tienda: tabTienda,
    bancarios: tabBancarios,
    exclusivo: tabExclusivo,
  };

  [tabTodos, tabTienda, tabBancarios, tabExclusivo].forEach((boton) => {
    if (!boton) return;
    const activo = boton === mapa[seccion];
    boton.classList.toggle("activo", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });
}

tabTodos?.addEventListener("click", () => {
  cambiarCategoria("todos", { actualizarHistorial: true });
  actualizarNavegacionPrincipal("todos");
});

tabTienda.addEventListener("click", () => {
  cambiarCategoria("tienda", { actualizarHistorial: true });
  actualizarNavegacionPrincipal("tienda");
});

tabBancarios.addEventListener("click", () => {
  cambiarCategoria("bancarios", { actualizarHistorial: true, desplazamiento: "auto" });
  actualizarNavegacionPrincipal("bancarios");
});

tabExclusivo?.addEventListener("click", () => {
  cambiarCategoria("exclusivo", { actualizarHistorial: true, desplazamiento: "auto" });
  actualizarNavegacionPrincipal("exclusivo");
});


/* Navegación táctil entre categorías de cupones.
   Deslizar a la izquierda avanza; a la derecha regresa.
   Solo reconoce un gesto horizontal claro para no interferir con el scroll vertical. */
function categoriasCuponDisponibles() {
  const categorias = ["todos", "tienda", "bancarios"];

  if (tabExclusivo && !tabExclusivo.hidden) {
    categorias.push("exclusivo");
  }

  return categorias;
}

function navegarCategoriaPorDeslizamiento(direccion) {
  const categorias = categoriasCuponDisponibles();
  const indiceActual = categorias.indexOf(categoriaActiva);

  if (indiceActual < 0) return;

  const nuevoIndice = indiceActual + direccion;
  if (nuevoIndice < 0 || nuevoIndice >= categorias.length) return;

  cambiarCategoria(categorias[nuevoIndice], {
    actualizarHistorial: true,
    desplazamiento: "auto",
  });
}

let swipeInicioX = 0;
let swipeInicioY = 0;
let swipeInicioTiempo = 0;
let swipeActivo = false;

vistaCupones?.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length !== 1) {
      swipeActivo = false;
      return;
    }

    const toque = event.touches[0];
    swipeInicioX = toque.clientX;
    swipeInicioY = toque.clientY;
    swipeInicioTiempo = Date.now();
    swipeActivo = true;
  },
  { passive: true }
);

vistaCupones?.addEventListener(
  "touchend",
  (event) => {
    if (!swipeActivo || event.changedTouches.length !== 1) return;
    swipeActivo = false;

    const toque = event.changedTouches[0];
    const deltaX = toque.clientX - swipeInicioX;
    const deltaY = toque.clientY - swipeInicioY;
    const duracion = Date.now() - swipeInicioTiempo;

    const distanciaHorizontal = Math.abs(deltaX);
    const distanciaVertical = Math.abs(deltaY);

    // Umbral suficiente para distinguir swipe de toque/clic y de scroll vertical.
    const esSwipeHorizontal =
      distanciaHorizontal >= 55 &&
      distanciaHorizontal > distanciaVertical * 1.35 &&
      duracion <= 700;

    if (!esSwipeHorizontal) return;

    // Dedo hacia la izquierda = siguiente categoría.
    navegarCategoriaPorDeslizamiento(deltaX < 0 ? 1 : -1);
  },
  { passive: true }
);

vistaCupones?.addEventListener(
  "touchcancel",
  () => {
    swipeActivo = false;
  },
  { passive: true }
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

botonRegresarCuponesAnirona?.addEventListener("click", () => {
  cambiarCategoria("todos", {
    actualizarHistorial: true,
    desplazamiento: "smooth",
  });
  actualizarNavegacionPrincipal("todos");
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

  const todosActivos = mostrarCupones && categoriaActiva === "todos";
  const tiendaActiva = mostrarCupones && categoriaActiva === "tienda";
  const bancariosActivos = mostrarCupones && categoriaActiva === "bancarios";
  const exclusivoActivo = mostrarCupones && categoriaActiva === "exclusivo";
  tabTodos?.classList.toggle("activo", todosActivos);
  tabTienda.classList.toggle("activo", tiendaActiva);
  tabBancarios.classList.toggle("activo", bancariosActivos);
  tabExclusivo?.classList.toggle("activo", exclusivoActivo);
  tabTodos?.setAttribute("aria-pressed", String(todosActivos));
  tabTienda.setAttribute("aria-pressed", String(tiendaActiva));
  tabBancarios.setAttribute("aria-pressed", String(bancariosActivos));
  tabExclusivo?.setAttribute("aria-pressed", String(exclusivoActivo));

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

function contenidoBotonCopiar() {
  return `${iconoCopias()}<span>Copiar código</span>`;
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

  if (coupon.agotado === true) {
    return {
      state: "agotado",
      target: end,
      start,
      end,
      label: "El cupón se agotó.",
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
          ? "🔥 ¡Últimos minutos!"
          : state === "finaliza-pronto"
            ? "🔥 Termina en"
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
  document.querySelectorAll(".cupon[data-id], .cupon-bancario-mini[data-id]").forEach((card) => {
    const coupon = todosLosCupones.find(
      (item) => String(item.id) === card.dataset.id
    );

    if (!coupon) return;

    const timeState = couponTimeState(coupon);
    const status = card.querySelector(".estado-programacion");
    const redeemButton = card.querySelector(".boton-canjear, .banco-canjear");

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

    if (timeState.state === "agotado") {
      status.hidden = false;
      status.className = "estado-programacion agotado";
      status.innerHTML = `<div class="estado-linea"><span class="estado-agotado-mensaje"><span class="estado-agotado-icono" aria-hidden="true">!</span><span>El cupón se agotó.</span></span></div>`;
      card.classList.add("cupon-agotado");
      redeemButton.disabled = true;
      redeemButton.classList.add("boton-agotado");
      redeemButton.textContent = "Cupón agotado";
      return;
    }

    if (timeState.state === "finalizado") {
      card.remove();

      if (!document.querySelector(".cupon[data-id], .cupon-bancario-mini[data-id]")) {
        todosWrapper.hidden = true;
        sinCupones.hidden = false;
      }

      return;
    }

    card.classList.remove("cupon-agotado");
    redeemButton.disabled = false;
    redeemButton.classList.remove("boton-programado", "boton-agotado");

    if (!redireccionEnProceso) {
      redeemButton.innerHTML = contenidoBotonCopiar();
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


function renderizarCategoriaConScrollEstable() {
  const scrollAntes = window.scrollY;
  renderizarCategoria();

  requestAnimationFrame(() => {
    window.scrollTo({
      left: 0,
      top: scrollAntes,
      behavior: "auto",
    });
  });
}

function programarFinPrioridadNuevo() {
  if (temporizadorPrioridadNuevo) {
    clearTimeout(temporizadorPrioridadNuevo);
    temporizadorPrioridadNuevo = null;
  }

  const ahora = Date.now();
  const vencimientos = todosLosCupones
    .filter((cupon) => cupon.activo !== false && cupon.agotado !== true)
    .map((cupon) => fechaPublicacionCupon(cupon))
    .filter(Boolean)
    .map((fecha) => fecha.getTime() + UNA_HORA_MS - ahora)
    .filter((restante) => restante > 0);

  if (!vencimientos.length) return;

  const espera = Math.min(...vencimientos);
  temporizadorPrioridadNuevo = window.setTimeout(() => {
    temporizadorPrioridadNuevo = null;
    renderizarCategoriaConScrollEstable();
  }, espera + 80);
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

  // Reordena automáticamente justo cuando termina la hora de prioridad "Nuevo".
  programarFinPrioridadNuevo();
}


const UNA_HORA_MS = 60 * 60 * 1000;
const DOS_HORAS_MS = 2 * UNA_HORA_MS;
const VEINTICUATRO_HORAS_MS = 24 * UNA_HORA_MS;
const SIETE_DIAS_MS = 7 * 24 * UNA_HORA_MS;
const MAX_ETIQUETAS_CUPON = 2;

function fechaPublicacionCupon(cupon) {
  const valor = cupon?.fecha_publicacion || cupon?.fecha_inicio || cupon?.fecha_creacion;

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

function normalizarCodigoHistorial(cupon) {
  return String(cupon?.codigo || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function valorNumericoCupon(valor) {
  const texto = String(valor ?? "")
    .replace(/\s/g, "")
    .replace(/,/g, "")
    .replace(/[^0-9.-]/g, "");
  const numero = Number.parseFloat(texto);
  return Number.isFinite(numero) ? Math.max(0, numero) : 0;
}

function idsTopPorMetrica(cupones, obtenerValor, proporcion = 0.20) {
  const candidatos = cupones
    .map((cupon) => ({ cupon, valor: Number(obtenerValor(cupon)) || 0 }))
    .filter(({ valor }) => valor > 0)
    .sort((a, b) => b.valor - a.valor);

  if (!candidatos.length) return new Set();
  const cantidad = Math.max(1, Math.ceil(candidatos.length * proporcion));
  return new Set(candidatos.slice(0, cantidad).map(({ cupon }) => Number(cupon.id)));
}

function crearContextoEtiquetas(cuponesActivos, todosCupones) {
  const activos = cuponesActivos.filter((cupon) => couponTimeState(cupon).enabled);
  const idsMasUsados = idsTopPorMetrica(activos, (cupon) => cupon.clics);
  const idsPopulares = idsTopPorMetrica(activos, (cupon) => cupon.likes);
  const idsMayorAhorro = idsTopPorMetrica(activos, (cupon) => valorNumericoCupon(cupon.ahorro_maximo));

  const candidatosTop = [...activos]
    .filter((cupon) => Number(cupon.clics || 0) > 0 || Number(cupon.likes || 0) > 0)
    .sort((a, b) => {
      const puntuacionA = Number(a.clics || 0) + Number(a.likes || 0) * 2;
      const puntuacionB = Number(b.clics || 0) + Number(b.likes || 0) * 2;
      if (puntuacionB !== puntuacionA) return puntuacionB - puntuacionA;
      return Number(b.id || 0) - Number(a.id || 0);
    });

  const codigosHistoricos = new Map();
  todosCupones.forEach((cupon) => {
    const codigo = normalizarCodigoHistorial(cupon);
    if (!codigo) return;
    if (!codigosHistoricos.has(codigo)) codigosHistoricos.set(codigo, []);
    codigosHistoricos.get(codigo).push(cupon);
  });

  return {
    idsMasUsados,
    idsPopulares,
    idsMayorAhorro,
    idTop: candidatosTop[0] ? Number(candidatosTop[0].id) : null,
    codigosHistoricos,
  };
}

function cuponRegreso(cupon, contexto) {
  const codigo = normalizarCodigoHistorial(cupon);
  if (!codigo) return false;

  const historial = contexto.codigosHistoricos.get(codigo) || [];
  if (historial.length < 2) return false;

  const fechaActual = fechaPublicacionCupon(cupon);
  if (!fechaActual) return false;
  const antiguedad = Date.now() - fechaActual.getTime();
  if (antiguedad < 0 || antiguedad > SIETE_DIAS_MS) return false;

  return historial.some((otro) => {
    if (Number(otro.id) === Number(cupon.id)) return false;
    const fechaOtro = fechaPublicacionCupon(otro);
    if (fechaOtro) return fechaOtro.getTime() < fechaActual.getTime();
    return Number(otro.id || 0) < Number(cupon.id || 0);
  });
}

function etiquetasAutomaticasCupon(cupon, contexto, maximo = MAX_ETIQUETAS_CUPON) {
  if (!couponTimeState(cupon).enabled) return [];

  const etiquetas = [];
  const ahora = Date.now();
  const fin = cupon?.fecha_fin ? new Date(cupon.fecha_fin).getTime() : NaN;
  const restante = Number.isFinite(fin) ? fin - ahora : Infinity;

  // Prioridad 1 y 2: son mutuamente excluyentes.
  if (restante > 0 && restante <= DOS_HORAS_MS) {
    etiquetas.push("ultima-oportunidad");
  } else if (restante > DOS_HORAS_MS && restante <= VEINTICUATRO_HORAS_MS) {
    etiquetas.push("ultimas-horas");
  }

  if (cuponRegreso(cupon, contexto)) etiquetas.push("regreso");
  if (contexto.idsMasUsados.has(Number(cupon.id))) etiquetas.push("mas-usado");
  if (contexto.idsPopulares.has(Number(cupon.id))) etiquetas.push("popular");
  if (contexto.idsMayorAhorro.has(Number(cupon.id))) etiquetas.push("mayor-ahorro");
  if (contexto.idTop !== null && Number(cupon.id) === contexto.idTop) etiquetas.push("top");
  if (esCuponNuevo(cupon)) etiquetas.push("nuevo");

  return [...new Set(etiquetas)].slice(0, Math.max(0, maximo));
}

function htmlEtiquetaCupon(estado) {
  const etiquetas = {
    "ultima-oportunidad": '<span class="etiqueta-cupon etiqueta-ultima-oportunidad">🔴 Última oportunidad</span>',
    "ultimas-horas": '<span class="etiqueta-cupon etiqueta-ultimas-horas">⏰ Últimas horas</span>',
    regreso: '<span class="etiqueta-cupon etiqueta-regreso">🔄 Regresó</span>',
    "mas-usado": '<span class="etiqueta-cupon etiqueta-mas-usado">⚡ Más usado</span>',
    popular: '<span class="etiqueta-cupon etiqueta-popular-integrada">🔥 Popular</span>',
    "mayor-ahorro": '<span class="etiqueta-cupon etiqueta-mayor-ahorro">💰 Mayor ahorro</span>',
    top: '<span class="etiqueta-cupon etiqueta-top">⭐ Top</span>',
    nuevo: '<span class="etiqueta-cupon etiqueta-nuevo">🆕 Nuevo</span>',
  };

  return etiquetas[estado] || "";
}

function htmlEtiquetasCupon(estados) {
  return (Array.isArray(estados) ? estados : [estados])
    .filter(Boolean)
    .map((estado) => htmlEtiquetaCupon(estado))
    .join("");
}


function colorTextoContraste(colorFondo) {
  const valor = String(colorFondo || "").trim();
  const hex = valor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!hex) return "#ffffff";

  let limpio = hex[1];
  if (limpio.length === 3) limpio = limpio.split("").map((c) => c + c).join("");

  const r = parseInt(limpio.slice(0, 2), 16) / 255;
  const g = parseInt(limpio.slice(2, 4), 16) / 255;
  const b = parseInt(limpio.slice(4, 6), 16) / 255;
  const convertir = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const luminancia = 0.2126 * convertir(r) + 0.7152 * convertir(g) + 0.0722 * convertir(b);

  // Umbral WCAG: elige automáticamente el texto con mejor contraste.
  return luminancia > 0.179 ? "#111827" : "#ffffff";
}

function configuracionVisualCategoria(categoria) {
  const etiquetas = window.ofertasEtiquetas || {};
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem("ofertas_imperdibles_config_cache") || "{}") || {}; } catch {}
  if (categoria === "exclusivo") {
    return {
      nombre: etiquetas.tarjetaExclusivo || cache.nombre_tarjeta_exclusivo || "CUPÓN EXCLUSIVO",
      color: etiquetas.colorTarjetaExclusivo || cache.color_tarjeta_exclusivo || "#f5c400",
    };
  }
  return {
    nombre: etiquetas.tarjetaTienda || cache.nombre_tarjeta_tienda || "CUPÓN DE TIENDA",
    color: etiquetas.colorTarjetaTienda || cache.color_tarjeta_tienda || "#22c55e",
  };
}

/* =========================================================
   V81.60 — Colores automáticos para cupones de Tienda
   - Cada cupón de Tienda recibe un color de una paleta controlada.
   - El color se calcula de forma estable a partir del cupón: no cambia
     al recargar ni al cambiar de sección.
   - Exclusivos y Bancarios conservan su comportamiento actual.
   ========================================================= */
const PALETA_CUPONES_TIENDA = [
  "#ff4b35", // coral / rojo oferta
  "#ffb000", // naranja dorado
  "#20bfa9", // turquesa
  "#16a6e8", // azul cielo
  "#6f67e8", // violeta
  "#e45b9a", // rosa
  "#39ad69", // verde
];

function colorAutomaticoCuponTienda(cupon) {
  const semilla = String(
    cupon?.id ?? cupon?.codigo ?? cupon?.titulo ?? "cupon-tienda"
  );

  // Hash sencillo y determinista: se ve aleatorio, pero el mismo cupón
  // conserva siempre su color entre recargas.
  let hash = 0;
  for (let i = 0; i < semilla.length; i += 1) {
    hash = ((hash << 5) - hash + semilla.charCodeAt(i)) | 0;
  }

  return PALETA_CUPONES_TIENDA[Math.abs(hash) % PALETA_CUPONES_TIENDA.length];
}

function configuracionVisualCupon(cupon) {
  const categoria = normalizarCategoria(cupon);
  const visual = configuracionVisualCategoria(categoria);

  if (categoria !== "tienda") return visual;

  return {
    ...visual,
    color: colorAutomaticoCuponTienda(cupon),
  };
}

function esCuponPorcentaje(cupon) {
  const titulo = String(cupon?.titulo || "");
  return /%|por\s*ciento/i.test(titulo);
}

function htmlCondicionesCupon(cupon) {
  const compraMinima = escaparHtml(cupon.compra_minima || "Consultar");
  const ahorroMaximo = escaparHtml(cupon.ahorro_maximo || "Consultar");
  const lineaAhorro = esCuponPorcentaje(cupon)
    ? `<p class="condicion-cupon condicion-ahorro">Ahorra hasta <strong>${ahorroMaximo}</strong></p>`
    : "";

  return `
    <div class="condiciones-cupon">
      <p class="condicion-cupon condicion-compra">En compras desde <strong>${compraMinima}</strong></p>
      ${lineaAhorro}
    </div>
  `;
}

function crearTarjeta(cupon, estadosDestacados = [], indice = 0) {
  const articulo = document.createElement("article");
  const categoria = normalizarCategoria(cupon);
  const esBancario = categoria === "bancarios";
  const esExclusivo = categoria === "exclusivo";
  const yaUsado = localStorage.getItem(claveUsado(cupon.id)) === "1";
  const yaLeGusta = localStorage.getItem(claveLike(cupon.id)) === "1";
  const visualCategoria = configuracionVisualCupon(cupon);

  const estados = Array.isArray(estadosDestacados) ? estadosDestacados.filter(Boolean) : [estadosDestacados].filter(Boolean);
  const clasesEstado = estados.map((estado) => ` cupon-${estado}`).join("");
  articulo.className = `cupon${clasesEstado}${esBancario ? " cupon-bancario" : ""}${esExclusivo ? " cupon-exclusivo" : ""}`;
  articulo.dataset.id = String(cupon.id);
  articulo.dataset.color = COLORES[indice % COLORES.length];
  articulo.style.setProperty("--categoria-cupon-color", visualCategoria.color);
  articulo.style.setProperty("--categoria-cupon-texto", colorTextoContraste(visualCategoria.color));

  articulo.innerHTML = `
    <div class="franja-categoria-cupon">${escaparHtml(visualCategoria.nombre)}</div>
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
        ${esExclusivo ? '<span class="etiqueta-cupon etiqueta-exclusivo">💎 Exclusivo</span>' : ""}
        ${htmlEtiquetasCupon(esExclusivo ? estados.slice(0, 1) : estados)}
      </div>

      ${esExclusivo && cupon.detalle_bancario
        ? `<p class="detalle-beneficio-exclusivo">${escaparHtml(cupon.detalle_bancario)}</p>`
        : ""}
      ${esBancario ? `<p class="beneficio-bancario">${escaparHtml(cupon.titulo)}</p>` : ""}

      ${htmlCondicionesCupon(cupon)}

      <div class="estado-programacion" hidden></div>

      <div class="acciones-bloque">
        <div class="acciones-cupon">
          <span class="cupon-copiado-mini" ${yaUsado ? "" : "hidden"}>✓ Ya copiado</span>
          <button class="boton-canjear" type="button" ${cupon.agotado === true ? "disabled aria-disabled=\"true\"" : ""}>
            ${contenidoBotonCopiar()}
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
    if (initialTimeState.state === "agotado") {
      articulo.classList.add("cupon-agotado");
      redeemButton.classList.add("boton-agotado");
      redeemButton.textContent = "Cupón agotado";
    } else {
      redeemButton.classList.add("boton-programado");
      redeemButton.textContent = "⏳ Disponible pronto";
    }
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


function obtenerBancoVisual(cupon) {
  const imagenOriginal = String(cupon.imagen_url || "");
  const codigo = String(cupon.codigo || "").toUpperCase().replace(/\s+/g, "");
  const titulo = String(cupon.titulo || "").toUpperCase();
  const detalle = String(cupon.detalle_bancario || "").toUpperCase();
  const texto = `${codigo} ${titulo} ${detalle} ${imagenOriginal.toUpperCase()}`;

  // V81.5: cada banco usa exactamente el logo proporcionado por el usuario.
  // La franja y el botón toman el color principal de la marca. Mercado Pago usa amarillo ML.
  const bancos = [
    { patron: /TCMP|MERCADO(?:\s|-|_)*PAGO.*VISA|MERCADO-PAGO-VISA/, banco: "mercado-pago-visa", logo: "/img/bancos/mercado-pago-visa.jpg", color: "#ffe600", texto: "#2b2b2b" },
    { patron: /MESES|MST|MERCADO(?:\s|-|_)*PAGO|MERCADO-PAGO/, banco: "mercado-pago", logo: "/img/bancos/mercado-pago.jpg", color: "#ffe600", texto: "#2b2b2b" },
    { patron: /BNMX|BANAMEX/, banco: "banamex", logo: "/img/bancos/banamex.jpg", color: "#e71950", texto: "#ffffff" },
    { patron: /BBVA/, banco: "bbva", logo: "/img/bancos/bbva.jpg", color: "#00549f", texto: "#ffffff" },
    { patron: /HSBC/, banco: "hsbc", logo: "/img/bancos/hsbc.jpg", color: "#db0011", texto: "#ffffff" },
    { patron: /AMEX|AMERICAN/, banco: "american-express", logo: "/img/bancos/american-express.jpg", color: "#0077a8", texto: "#ffffff" },
    { patron: /INVE|INVEX/, banco: "invex", logo: "/img/bancos/invex.jpg", color: "#c60045", texto: "#ffffff" },
    { patron: /SCOT|SCOTIA/, banco: "scotiabank", logo: "/img/bancos/scotiabank.jpg", color: "#ec111a", texto: "#ffffff" },
    { patron: /AFRM|AFIRME/, banco: "afirme", logo: "/img/bancos/afirme.jpg", color: "#009c76", texto: "#ffffff" },
    { patron: /MIFE|MIFEL/, banco: "mifel", logo: "/img/bancos/mifel.jpg", color: "#003b67", texto: "#ffffff" },
    { patron: /INBR|INBURSA/, banco: "inbursa", logo: "/img/bancos/inbursa.jpg", color: "#00457c", texto: "#ffffff" },
    { patron: /FALA|FALABELLA/, banco: "falabella", logo: "/img/bancos/falabella.jpg", color: "#19b81f", texto: "#ffffff" },
    { patron: /DIDI/, banco: "didi-card", logo: "/img/bancos/didi-card.jpg", color: "#ff5a00", texto: "#ffffff" },
    { patron: /OPBA|OPENBANK/, banco: "openbank", logo: "/img/bancos/openbank.jpg", color: "#111111", texto: "#ffffff" },
    { patron: /BANO|BANORTE/, banco: "banorte", logo: "/img/bancos/banorte.jpg", color: "#e30613", texto: "#ffffff" },
    { patron: /SANT|SANTANDER/, banco: "santander", logo: "/img/bancos/santander.jpg", color: "#ec0000", texto: "#ffffff" },
  ];

  const banco = bancos.find(({ patron }) => patron.test(texto));
  if (banco) return banco;

  return {
    banco: "generico",
    logo: imagenOriginal,
    color: "#17139d",
    texto: "#ffffff",
  };
}

function obtenerLogoBanco(cupon) {
  return obtenerBancoVisual(cupon).logo;
}

function crearTarjetaBancaria(cupon, estadosDestacados = []) {
  const articulo = document.createElement("article");
  const estados = Array.isArray(estadosDestacados) ? estadosDestacados.filter(Boolean) : [estadosDestacados].filter(Boolean);
  articulo.className = `cupon-bancario-mini${estados.map((estado) => ` cupon-${estado}`).join("")}`;
  articulo.dataset.id = String(cupon.id);

  const bancoVisual = obtenerBancoVisual(cupon);
  const logoBanco = bancoVisual.logo;
  const yaUsado = localStorage.getItem(claveUsado(cupon.id)) === "1";
  const yaLeGusta = localStorage.getItem(claveLike(cupon.id)) === "1";
  articulo.dataset.banco = bancoVisual.banco;
  articulo.style.setProperty("--banco-color", bancoVisual.color);
  articulo.style.setProperty("--banco-texto", bancoVisual.texto);
  articulo.style.setProperty("--banco-franja-texto", colorTextoContraste(bancoVisual.color));
  articulo.innerHTML = `
    <div class="banco-logo-area">
      ${logoBanco ? `<img class="banco-logo" src="${escaparHtml(logoBanco)}" alt="" loading="lazy" />` : `<span class="banco-logo-fallback">BANCO</span>`}
    </div>
    <div class="banco-franja">CUPÓN BANCARIO</div>
    <div class="cupon-etiquetas banco-etiquetas">${htmlEtiquetasCupon(estados)}</div>
    <div class="banco-cuerpo">
      <div class="banco-info">
        <h3>${escaparHtml(cupon.titulo || "Beneficio bancario")}</h3>
        ${cupon.detalle_bancario ? `<p class="banco-detalle">${escaparHtml(cupon.detalle_bancario)}</p>` : ""}
        ${htmlCondicionesCupon(cupon)}
      </div>
      <div class="banco-pie">
        <div class="estado-programacion" hidden></div>
        <span class="cupon-copiado-mini banco-copiado-mini" ${yaUsado ? "" : "hidden"}>✓ Ya copiado</span>
        <button class="banco-canjear" type="button" ${cupon.agotado === true ? "disabled aria-disabled=\"true\"" : ""}>${contenidoBotonCopiar()}</button>
        <div class="acciones-secundarias banco-acciones-extra" aria-label="Interacciones del cupón">
          <button
            class="boton-like banco-like ${yaLeGusta ? "activo" : ""}"
            type="button"
            aria-label="Me gusta"
            title="Me gusta"
          >
            ${iconoMeGusta()}
          </button>

          <button
            class="boton-compartir banco-compartir"
            type="button"
            aria-label="Compartir cupón"
            title="Compartir cupón"
          >
            ${iconoCompartir()}
          </button>

          <div class="estadisticas-cupon banco-estadisticas">
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
        <p class="mensaje" aria-live="polite"></p>
      </div>
    </div>
  `;

  const boton = articulo.querySelector(".banco-canjear");
  const estadoInicial = couponTimeState(cupon);
  if (!estadoInicial.enabled) {
    boton.disabled = true;
    if (estadoInicial.state === "agotado") {
      articulo.classList.add("cupon-agotado");
      boton.classList.add("boton-agotado");
      boton.textContent = "Cupón agotado";
    } else {
      boton.textContent = "⏳ Disponible pronto";
    }
  }
  boton.addEventListener("click", () => {
    if (couponTimeState(cupon).enabled) copiarYCanjear(cupon, articulo);
  });
  articulo.querySelector(".banco-compartir")?.addEventListener("click", () => compartirPagina(articulo));
  articulo.querySelector(".banco-like")?.addEventListener("click", () => darMeGusta(cupon, articulo));
  return articulo;
}

function normalizarCategoria(cupon) {
  const categoria = String(cupon.categoria || "tienda").toLowerCase();

  if (categoria === "bancario" || categoria === "bancarios") return "bancarios";
  if (categoria === "exclusivo" || categoria === "exclusivos") return "exclusivo";
  return "tienda";
}

/* =========================================================
   V81.67 — Asistente para encontrar el mejor cupón
   Usa los mismos datos ya capturados en el administrador:
   título, compra mínima, ahorro máximo, categoría y vigencia.
   ========================================================= */
function numeroDineroCupon(valor) {
  const texto = String(valor ?? "").trim();
  if (!texto) return 0;

  // Los montos del administrador normalmente vienen como $2,500 o 2500.
  // Conservamos el separador decimal cuando es inequívoco.
  const limpio = texto.replace(/[^\d.,-]/g, "");
  if (!limpio) return 0;

  let normalizado = limpio;
  const tienePunto = limpio.includes(".");
  const tieneComa = limpio.includes(",");

  if (tienePunto && tieneComa) {
    normalizado = limpio.lastIndexOf(".") > limpio.lastIndexOf(",")
      ? limpio.replace(/,/g, "")
      : limpio.replace(/\./g, "").replace(",", ".");
  } else if (tieneComa) {
    const partes = limpio.split(",");
    normalizado = partes.length === 2 && partes[1].length <= 2
      ? `${partes[0]}.${partes[1]}`
      : limpio.replace(/,/g, "");
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? Math.max(0, numero) : 0;
}

function monedaBuscador(valor) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: Number.isInteger(Number(valor)) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0);
}

function cuponAplicaFiltroBuscador(cupon) {
  const categoria = normalizarCategoria(cupon);
  if (filtroBuscadorCupones === "bancarios") return categoria === "bancarios";
  if (filtroBuscadorCupones === "generales") return categoria !== "bancarios";
  return true;
}

function cuponDisponibleParaBuscador(cupon) {
  return Boolean(
    cupon &&
    cupon.activo !== false &&
    cupon.agotado !== true &&
    normalizarCategoria(cupon) !== "exclusivo" &&
    couponTimeState(cupon).enabled &&
    String(cupon.codigo || "").trim() &&
    cuponAplicaFiltroBuscador(cupon)
  );
}

function calcularBeneficioCupon(cupon, montoCompra) {
  const monto = Number(montoCompra) || 0;
  const minimo = numeroDineroCupon(cupon.compra_minima);
  if (monto <= 0 || monto < minimo) return null;

  const titulo = String(cupon.titulo || "").toUpperCase();
  const maximo = numeroDineroCupon(cupon.ahorro_maximo);
  const porcentaje = titulo.match(/(\d+(?:[.,]\d+)?)\s*%/);
  const montoFijo = titulo.match(/^\s*\$\s*([\d,.]+)/)
    || titulo.match(/\$?\s*([\d,.]+)\s*(?:OFF|DE DESCUENTO)/i);

  let ahorro = 0;

  if (porcentaje) {
    const tasa = Number(porcentaje[1].replace(",", "."));
    ahorro = monto * (tasa / 100);
    if (maximo > 0) ahorro = Math.min(ahorro, maximo);
  } else if (montoFijo) {
    ahorro = numeroDineroCupon(montoFijo[1]);
    if (maximo > 0) ahorro = Math.min(ahorro, maximo);
  } else if (maximo > 0) {
    // Respaldo para cupones capturados sin porcentaje/monto en el título.
    ahorro = maximo;
  }

  ahorro = Math.min(Math.max(ahorro, 0), monto);
  if (ahorro <= 0) return null;

  return {
    cupon,
    minimo,
    ahorro,
    totalFinal: Math.max(0, monto - ahorro),
  };
}

function prioridadCategoriaBuscador(cupon) {
  const categoria = normalizarCategoria(cupon);
  // Prioridad solicitada: Tienda primero. Bancarios quedan como segunda
  // alternativa y Exclusivos al final porque suelen aplicar a menos artículos.
  if (categoria === "tienda") return 0;
  if (categoria === "bancarios") return 1;
  if (categoria === "exclusivo") return 2;
  return 3;
}

function ahorroPotencialBuscador(resultado) {
  if (!resultado?.cupon) return 0;
  const maximo = numeroDineroCupon(resultado.cupon.ahorro_maximo);
  // Para ordenar las recomendaciones priorizamos el mayor beneficio publicado
  // del cupón. Si no existe tope capturado, usamos el ahorro calculado al monto.
  return maximo > 0 ? maximo : Number(resultado.ahorro || 0);
}

function obtenerCuponesAplicablesOrdenados(monto) {
  return todosLosCupones
    .filter(cuponDisponibleParaBuscador)
    .map((cupon) => calcularBeneficioCupon(cupon, monto))
    .filter(Boolean)
    .sort((a, b) => {
      // Regla de recomendación: Tienda primero y Exclusivo siempre al final.
      // Dentro de cada grupo conservamos la prioridad por mayor ahorro potencial.
      const prioridad = prioridadCategoriaBuscador(a.cupon) - prioridadCategoriaBuscador(b.cupon);
      if (prioridad !== 0) return prioridad;
      const potencial = ahorroPotencialBuscador(b) - ahorroPotencialBuscador(a);
      if (potencial !== 0) return potencial;
      if (b.ahorro !== a.ahorro) return b.ahorro - a.ahorro;
      if (a.totalFinal !== b.totalFinal) return a.totalFinal - b.totalFinal;
      return b.minimo - a.minimo;
    });
}

function obtenerMejorCuponParaMonto(monto) {
  return obtenerCuponesAplicablesOrdenados(monto)[0] || null;
}

function obtenerCuponMasCercano(monto) {
  return todosLosCupones
    .filter(cuponDisponibleParaBuscador)
    .map((cupon) => {
      const minimo = numeroDineroCupon(cupon.compra_minima);
      if (minimo <= monto) return null;
      const calculoEnMinimo = calcularBeneficioCupon(cupon, minimo);
      return {
        cupon,
        minimo,
        faltante: minimo - monto,
        ahorro: calculoEnMinimo?.ahorro || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const prioridad = prioridadCategoriaBuscador(a.cupon) - prioridadCategoriaBuscador(b.cupon);
      if (prioridad !== 0) return prioridad;
      if (a.faltante !== b.faltante) return a.faltante - b.faltante;
      return b.ahorro - a.ahorro;
    })[0] || null;
}

function obtenerSiguienteOportunidadCupon(monto, mejorActual = null) {
  const ahorroActual = Number(mejorActual?.ahorro || 0);

  return todosLosCupones
    .filter(cuponDisponibleParaBuscador)
    .map((cupon) => {
      const minimo = numeroDineroCupon(cupon.compra_minima);
      if (minimo <= monto) return null;

      const calculo = calcularBeneficioCupon(cupon, minimo);
      if (!calculo || calculo.ahorro <= ahorroActual) return null;

      return {
        cupon,
        minimo,
        faltante: minimo - monto,
        ahorro: calculo.ahorro,
        totalFinal: calculo.totalFinal,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const prioridad = prioridadCategoriaBuscador(a.cupon) - prioridadCategoriaBuscador(b.cupon);
      if (prioridad !== 0) return prioridad;
      if (a.faltante !== b.faltante) return a.faltante - b.faltante;
      return b.ahorro - a.ahorro;
    })[0] || null;
}

function actualizarFiltrosBuscadorCupones() {
  if (!buscadorCuponesFiltrosContenedor) return;

  const disponibles = todosLosCupones.filter((cupon) => Boolean(
    cupon &&
    cupon.activo !== false &&
    cupon.agotado !== true &&
    couponTimeState(cupon).enabled &&
    String(cupon.codigo || "").trim()
  ));

  const hayGenerales = disponibles.some((cupon) => normalizarCategoria(cupon) !== "bancarios");
  const hayBancarios = disponibles.some((cupon) => normalizarCategoria(cupon) === "bancarios");
  const hayAlternativas = hayGenerales && hayBancarios;

  buscadorCuponesFiltrosContenedor.hidden = !hayAlternativas;

  if (!hayAlternativas) {
    filtroBuscadorCupones = "todos";
    buscadorCuponesFiltros.forEach((boton) => {
      const activo = boton.dataset.buscadorFiltro === "todos";
      boton.classList.toggle("activo", activo);
      boton.setAttribute("aria-pressed", String(activo));
    });
  }
}

function etiquetaCategoriaBuscador(cupon) {
  const categoria = normalizarCategoria(cupon);
  if (categoria === "bancarios") return "Bancario";
  if (categoria === "exclusivo") return "Exclusivo";
  return "Tienda";
}

function usarCuponDesdeBuscador(cupon) {
  const categoria = normalizarCategoria(cupon);
  cambiarCategoria(categoria, { actualizarHistorial: true, desplazamiento: "auto" });

  window.requestAnimationFrame(() => {
    const tarjeta = cuponesContainer?.querySelector(`[data-id="${Number(cupon.id)}"]`);
    if (!tarjeta) return;

    tarjeta.classList.add("buscador-cupon-destacado");
    tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      tarjeta.querySelector(".boton-canjear, .banco-canjear")?.click();
    }, 360);
    window.setTimeout(() => tarjeta.classList.remove("buscador-cupon-destacado"), 1600);
  });
}

function aplicarColorBotonBuscador(boton, cupon) {
  if (!boton || !cupon) return;

  const categoria = normalizarCategoria(cupon);
  let color = "#1cac17";
  let texto = "#ffffff";

  if (categoria === "bancarios") {
    const bancoVisual = obtenerBancoVisual(cupon);
    color = bancoVisual.color;
    texto = bancoVisual.texto || colorTextoContraste(color);
  } else {
    const estilosRaiz = getComputedStyle(document.documentElement);
    color = estilosRaiz.getPropertyValue("--color-boton-tienda-exclusivo").trim() || "#1cac17";
    texto = estilosRaiz.getPropertyValue("--color-texto-boton-tienda-exclusivo").trim() || colorTextoContraste(color);
  }

  boton.style.setProperty("--buscador-accion-color", color);
  boton.style.setProperty("--buscador-accion-texto", texto);
}

function cerrarResultadoBuscador() {
  if (!buscadorCuponesResultado) return;
  buscadorCuponesResultado.hidden = true;
  buscadorCuponesResultado.innerHTML = "";
  buscadorCuponesResultado.className = "buscador-cupones-resultado";
  if (buscadorCuponesMonto) {
    buscadorCuponesMonto.value = "";
    buscadorCuponesMonto.focus();
  }
}

function agregarCierreResultadoBuscador() {
  if (!buscadorCuponesResultado || buscadorCuponesResultado.hidden) return;
  const botonCerrar = document.createElement("button");
  botonCerrar.type = "button";
  botonCerrar.className = "buscador-resultado-cerrar";
  botonCerrar.setAttribute("aria-label", "Cerrar recomendación");
  botonCerrar.setAttribute("title", "Cerrar");
  botonCerrar.textContent = "×";
  botonCerrar.addEventListener("click", cerrarResultadoBuscador);
  buscadorCuponesResultado.appendChild(botonCerrar);
}

function resaltarCuponRecomendado(cupon) {
  document.querySelectorAll(".buscador-cupon-destacado").forEach((tarjeta) => {
    tarjeta.classList.remove("buscador-cupon-destacado");
  });
  if (!cuponesContainer || !cupon) return;
  const tarjeta = cuponesContainer.querySelector(`[data-id="${Number(cupon.id)}"]`);
  if (!tarjeta) return;
  // Reinicia la animación sin desplazar al usuario.
  void tarjeta.offsetWidth;
  tarjeta.classList.add("buscador-cupon-destacado");
  window.setTimeout(() => tarjeta.classList.remove("buscador-cupon-destacado"), 1900);
}

function renderResultadoBuscador(monto, { conservarAlternativa = false } = {}) {
  if (!buscadorCuponesResultado) return;

  const valor = Number(monto) || 0;
  buscadorCuponesResultado.hidden = false;
  buscadorCuponesResultado.className = "buscador-cupones-resultado resultado-aviso";

  if (valor <= 0) {
    indiceAlternativaBuscador = 0;
    buscadorCuponesResultado.hidden = true;
    buscadorCuponesResultado.innerHTML = "";
    buscadorCuponesResultado.className = "buscador-cupones-resultado";
    return;
  }

  const aplicables = obtenerCuponesAplicablesOrdenados(valor);
  const conservarPorLectura = indiceAlternativaBuscador > 0 && Date.now() < mantenerAlternativaHasta;
  if (!conservarAlternativa && !conservarPorLectura) indiceAlternativaBuscador = 0;
  if (aplicables.length > 0) {
    indiceAlternativaBuscador = Math.min(indiceAlternativaBuscador, aplicables.length - 1);
    const mejor = aplicables[indiceAlternativaBuscador];
    const { cupon, ahorro, totalFinal, minimo } = mejor;
    const potencial = ahorroPotencialBuscador(mejor);
    const siguiente = obtenerSiguienteOportunidadCupon(valor, mejor);
    const siguienteHtml = siguiente
      ? `<div class="buscador-siguiente-oportunidad">
          <strong>💡 Siguiente oportunidad:</strong>
          Agrega <strong>${monedaBuscador(siguiente.faltante)} más</strong> para completar una compra de
          <strong>${monedaBuscador(siguiente.minimo)}</strong>, obtener un descuento aproximado de
          <strong>${monedaBuscador(siguiente.ahorro)}</strong> y pagar aproximadamente
          <strong>${monedaBuscador(siguiente.totalFinal)}</strong>.
        </div>`
      : "";

    const esExclusivo = normalizarCategoria(cupon) === "exclusivo";
    const avisoExclusivo = esExclusivo
      ? `<div class="buscador-aviso-exclusivo"><strong>ℹ️ Cupón exclusivo:</strong> aplica únicamente en productos seleccionados.</div>`
      : "";

    const haySiguiente = indiceAlternativaBuscador < aplicables.length - 1;
    const hayAnterior = indiceAlternativaBuscador > 0;
    const otraHtml = haySiguiente || hayAnterior
      ? `<div class="buscador-otra-opcion">
          <span>🎟️ <strong>${haySiguiente ? "Hay otro cupón que también puedes utilizar." : "Estás viendo la última opción disponible."}</strong> Algunos cupones pueden no aplicar a todos los productos.</span>
          <div class="buscador-alternativas-acciones">
            ${haySiguiente ? '<button class="buscador-ver-otro" type="button">Ver otro cupón</button>' : ''}
            ${hayAnterior ? '<button class="buscador-anterior" type="button">Anterior</button>' : ''}
          </div>
        </div>`
      : "";

    const tituloResultado = indiceAlternativaBuscador === 0 ? "Mayor ahorro disponible" : "Otra opción disponible";
    const etiquetaAhorro = potencial > ahorro ? "Ahorro máximo" : "Ahorras aprox.";
    const valorAhorro = potencial > ahorro ? potencial : ahorro;

    buscadorCuponesResultado.className = "buscador-cupones-resultado resultado-exito";
    buscadorCuponesResultado.innerHTML = `
      <p class="buscador-resultado-titulo">🎟️ <strong>${tituloResultado}</strong></p>
      <p class="buscador-resultado-texto">${escaparHtml(cupon.titulo)} · ${etiquetaCategoriaBuscador(cupon)}</p>
      <div class="buscador-resultado-resumen">
        <div class="buscador-resultado-dato"><span>Compra mínima</span><strong>${monedaBuscador(minimo)}</strong></div>
        <div class="buscador-resultado-dato"><span>${etiquetaAhorro}</span><strong>${monedaBuscador(valorAhorro)}</strong></div>
        <div class="buscador-resultado-dato"><span>Pagarías aprox.</span><strong>${monedaBuscador(totalFinal)}</strong></div>
      </div>
      ${avisoExclusivo}
      <button class="buscador-resultado-accion" type="button">${iconoCopias()}<span>Usar este cupón</span></button>
      ${otraHtml}
      ${siguienteHtml}
    `;
    const botonUsarCupon = buscadorCuponesResultado.querySelector(".buscador-resultado-accion");
    aplicarColorBotonBuscador(botonUsarCupon, cupon);
    botonUsarCupon?.addEventListener("click", () => usarCuponDesdeBuscador(cupon));

    const programarRegresoCuponPrincipal = () => {
      window.clearTimeout(temporizadorRegresoCuponPrincipal);
      mantenerAlternativaHasta = Date.now() + TIEMPO_REGRESO_CUPON_PRINCIPAL;
      temporizadorRegresoCuponPrincipal = window.setTimeout(() => {
        mantenerAlternativaHasta = 0;
        indiceAlternativaBuscador = 0;
        renderResultadoBuscador(valor, { conservarAlternativa: true });
        ajustarBuscadorSobreTeclado({ resultado: true });
      }, TIEMPO_REGRESO_CUPON_PRINCIPAL);
    };

    buscadorCuponesResultado.querySelector(".buscador-ver-otro")?.addEventListener("click", () => {
      indiceAlternativaBuscador = Math.min(indiceAlternativaBuscador + 1, aplicables.length - 1);
      renderResultadoBuscador(valor, { conservarAlternativa: true });
      programarRegresoCuponPrincipal();
      ajustarBuscadorSobreTeclado({ resultado: true });
    });

    buscadorCuponesResultado.querySelector(".buscador-anterior")?.addEventListener("click", () => {
      indiceAlternativaBuscador = Math.max(indiceAlternativaBuscador - 1, 0);
      renderResultadoBuscador(valor, { conservarAlternativa: true });
      if (indiceAlternativaBuscador > 0) {
        programarRegresoCuponPrincipal();
      } else {
        window.clearTimeout(temporizadorRegresoCuponPrincipal);
        mantenerAlternativaHasta = 0;
      }
      ajustarBuscadorSobreTeclado({ resultado: true });
    });

    agregarCierreResultadoBuscador();
    return;
  }

  const cercano = obtenerCuponMasCercano(valor);
  if (cercano) {
    const totalCercano = Math.max(0, cercano.minimo - cercano.ahorro);
    const ahorroTexto = cercano.ahorro > 0
      ? ` Al llegar a ${monedaBuscador(cercano.minimo)} podrías ahorrar aproximadamente <strong>${monedaBuscador(cercano.ahorro)}</strong> y pagar alrededor de <strong>${monedaBuscador(totalCercano)}</strong>.`
      : ` Al llegar a ${monedaBuscador(cercano.minimo)} podrás intentar aplicar ese cupón.`;

    buscadorCuponesResultado.className = "buscador-cupones-resultado resultado-cerca";
    buscadorCuponesResultado.innerHTML = `
      <p class="buscador-resultado-titulo">👀 <strong>¡Estás muy cerca!</strong></p>
      <p class="buscador-resultado-texto">Agrega <strong>${monedaBuscador(cercano.faltante)} más</strong> a tu compra para acceder a una mejor opción (${escaparHtml(cercano.cupon.titulo)}).${ahorroTexto}</p>
    `;
    agregarCierreResultadoBuscador();
    return;
  }

  const hayDisponibles = todosLosCupones.some(cuponDisponibleParaBuscador);
  buscadorCuponesResultado.innerHTML = hayDisponibles
    ? `<p class="buscador-resultado-titulo"><strong>No encontramos un cupón calculable para ese monto.</strong></p><p class="buscador-resultado-texto">Puedes revisar los cupones disponibles debajo para consultar sus condiciones.</p>`
    : `<p class="buscador-resultado-titulo"><strong>No hay cupones disponibles en esta categoría por ahora.</strong></p><p class="buscador-resultado-texto">Prueba con otro tipo de cupón.</p>`;
}

function ajustarBuscadorSobreTeclado({ resultado = false } = {}) {
  if (!buscadorCuponesSeccion || document.activeElement !== buscadorCuponesMonto) return;

  window.clearTimeout(ajusteTecladoProgramado);
  ajusteTecladoProgramado = window.setTimeout(() => {
    const objetivo = resultado && !buscadorCuponesResultado?.hidden
      ? buscadorCuponesResultado
      : buscadorCuponesSeccion;

    objetivo?.scrollIntoView({
      behavior: "smooth",
      block: resultado ? "nearest" : "start",
      inline: "nearest",
    });
  }, 90);
}

function ejecutarBuscadorCupones() {
  const monto = Number(buscadorCuponesMonto?.value || 0);
  renderResultadoBuscador(monto);
}

buscadorCuponesForm?.addEventListener("submit", (evento) => {
  evento.preventDefault();
  ejecutarBuscadorCupones();
});

let temporizadorBuscadorCupones = null;
buscadorCuponesMonto?.addEventListener("input", () => {
  indiceAlternativaBuscador = 0;
  mantenerAlternativaHasta = 0;
  window.clearTimeout(temporizadorRegresoCuponPrincipal);
  window.clearTimeout(temporizadorBuscadorCupones);

  const valorTexto = String(buscadorCuponesMonto.value || "").trim();
  if (!valorTexto || Number(valorTexto) <= 0) {
    if (buscadorCuponesResultado) {
      buscadorCuponesResultado.hidden = true;
      buscadorCuponesResultado.innerHTML = "";
      buscadorCuponesResultado.className = "buscador-cupones-resultado";
    }
    return;
  }

  temporizadorBuscadorCupones = window.setTimeout(() => {
    ejecutarBuscadorCupones();
    ajustarBuscadorSobreTeclado({ resultado: true });
  }, 180);
});
buscadorCuponesMonto?.addEventListener("focus", () => {
  if (posicionAntesBuscador === null) posicionAntesBuscador = window.scrollY;
  buscadorCuponesSeccion?.classList.add("modo-teclado");

  // El teclado móvil tarda un instante en ocupar espacio; hacemos dos ajustes
  // para que el campo y la recomendación permanezcan dentro del área visible.
  window.setTimeout(() => ajustarBuscadorSobreTeclado(), 120);
  window.setTimeout(() => ajustarBuscadorSobreTeclado({ resultado: true }), 360);
});

buscadorCuponesMonto?.addEventListener("blur", (evento) => {
  window.clearTimeout(ajusteTecladoProgramado);

  const siguienteFoco = evento.relatedTarget;
  const sigueDentroBuscador = siguienteFoco && buscadorCuponesSeccion?.contains(siguienteFoco);

  buscadorCuponesSeccion?.classList.remove("modo-teclado");

  if (!sigueDentroBuscador && posicionAntesBuscador !== null) {
    const destino = posicionAntesBuscador;
    posicionAntesBuscador = null;
    window.setTimeout(() => {
      window.scrollTo({ top: destino, behavior: "smooth" });
    }, 180);
  }
});

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    if (document.activeElement === buscadorCuponesMonto) {
      ajustarBuscadorSobreTeclado({ resultado: true });
    }
  });
}


buscadorCuponesFiltros.forEach((boton) => {
  boton.addEventListener("click", () => {
    indiceAlternativaBuscador = 0;
    filtroBuscadorCupones = boton.dataset.buscadorFiltro || "todos";
    buscadorCuponesFiltros.forEach((item) => {
      const activo = item === boton;
      item.classList.toggle("activo", activo);
      item.setAttribute("aria-pressed", String(activo));
    });

    if (Number(buscadorCuponesMonto?.value || 0) > 0) ejecutarBuscadorCupones();
  });
});

function cambiarCategoria(
  categoria,
  {
    actualizarHistorial = false,
    desplazamiento = "smooth",
  } = {}
) {
  const scrollAntesDeCambiarCategoria = window.scrollY;
  categoriaActiva = categoria;

  cambiarVista("cupones", {
    actualizarHistorial: false,
    desplazamiento,
    moverAlInicio: false,
  });

  const esTodos = categoria === "todos";
  const esTienda = categoria === "tienda";
  const esBancarios = categoria === "bancarios";
  const esExclusivo = categoria === "exclusivo";

  tabTodos?.classList.toggle("activo", esTodos);
  tabTienda.classList.toggle("activo", esTienda);
  tabBancarios.classList.toggle("activo", esBancarios);
  tabExclusivo?.classList.toggle("activo", esExclusivo);

  tabTodos?.setAttribute("aria-pressed", String(esTodos));
  tabTienda.setAttribute("aria-pressed", String(esTienda));
  tabBancarios.setAttribute("aria-pressed", String(esBancarios));
  tabExclusivo?.setAttribute("aria-pressed", String(esExclusivo));
  actualizarNavegacionPrincipal(
    esTodos ? "todos" : esTienda ? "tienda" : esBancarios ? "bancarios" : "exclusivo"
  );

  renderizarCategoria();

  // Mantiene exactamente la posición vertical del usuario al navegar entre
  // Todos / Tienda / Bancarios / Exclusivo. Se restaura tras el layout final.
  requestAnimationFrame(() => {
    window.scrollTo({
      left: 0,
      top: scrollAntesDeCambiarCategoria,
      behavior: "auto",
    });
  });

  if (actualizarHistorial) {
    actualizarUrlSeccion(categoria);
  }
}

function limpiarVista() {
  cuponesContainer.replaceChildren();
  todosWrapper.hidden = true;
  sinCupones.hidden = true;
  if (recordatorioCuponesAgotados) recordatorioCuponesAgotados.hidden = true;
}

function renderizarCategoria() {
  limpiarVista();

  const disponibles = todosLosCupones
    .filter((cupon) => cupon.activo !== false)
    .filter((cupon) => couponTimeState(cupon).state !== "finalizado");

  // V81.85 — Prioridad temporal de cupones NUEVOS.
  // 1) Activos antes que agotados.
  // 2) Durante su primera hora, los cupones con estado Nuevo suben al inicio.
  // 3) Al cumplir la hora vuelven automáticamente al orden habitual por popularidad (clics).
  const ordenarCupones = (a, b) => {
    const agotadoA = a.agotado === true ? 1 : 0;
    const agotadoB = b.agotado === true ? 1 : 0;
    if (agotadoA !== agotadoB) return agotadoA - agotadoB;

    const nuevoA = esCuponNuevo(a) ? 1 : 0;
    const nuevoB = esCuponNuevo(b) ? 1 : 0;
    if (nuevoA !== nuevoB) return nuevoB - nuevoA;

    // Si hay varios nuevos al mismo tiempo, el publicado más recientemente va primero.
    if (nuevoA && nuevoB) {
      const fechaA = fechaPublicacionCupon(a)?.getTime() || 0;
      const fechaB = fechaPublicacionCupon(b)?.getTime() || 0;
      if (fechaB !== fechaA) return fechaB - fechaA;
    }

    const clicsA = Number(a.clics || 0);
    const clicsB = Number(b.clics || 0);
    if (clicsB !== clicsA) return clicsB - clicsA;
    return Number(b.id || 0) - Number(a.id || 0);
  };

  const cuponesTienda = disponibles
    .filter((cupon) => normalizarCategoria(cupon) === "tienda")
    .sort(ordenarCupones);

  const cuponesExclusivos = disponibles
    .filter((cupon) => normalizarCategoria(cupon) === "exclusivo")
    .sort(ordenarCupones);

  const cuponesBancarios = disponibles
    .filter((cupon) => normalizarCategoria(cupon) === "bancarios")
    .sort(ordenarCupones);

  const mostrarTienda =
    categoriaActiva === "todos" || categoriaActiva === "tienda";
  const mostrarExclusivos =
    categoriaActiva === "todos" || categoriaActiva === "exclusivo";
  const mostrarBancarios =
    categoriaActiva === "todos" || categoriaActiva === "bancarios";

  if (cuponesContainer) cuponesContainer.hidden = false;

  document.body.classList.remove("vista-bancarios");
  const tituloCupones = document.querySelector("#titulo-seccion-cupones");
  if (tituloCupones) {
    const filaTitulo = tituloCupones.closest(".titulo-fila");
    filaTitulo?.classList.add("titulo-fila--tienda");
    filaTitulo?.classList.remove("titulo-fila--bancarios");
    tituloCupones.textContent = "";
    tituloCupones.setAttribute("aria-hidden", "true");
  }

  const totalVisible =
    (mostrarTienda ? cuponesTienda.length : 0) +
    (mostrarExclusivos ? cuponesExclusivos.length : 0) +
    (mostrarBancarios ? cuponesBancarios.length : 0);

  document.body.classList.toggle("hay-cupones-visibles", totalVisible > 0);

  const hayAgotadosVisibles =
    (mostrarTienda && cuponesTienda.some((cupon) => cupon.agotado === true)) ||
    (mostrarExclusivos && cuponesExclusivos.some((cupon) => cupon.agotado === true)) ||
    (mostrarBancarios && cuponesBancarios.some((cupon) => cupon.agotado === true));
  if (recordatorioCuponesAgotados) recordatorioCuponesAgotados.hidden = !hayAgotadosVisibles;

  if (totalVisible === 0) {
    sinCupones.querySelector("h2").textContent = "¡No hay cupones disponibles!";
    sinCupones.querySelector("p").textContent = "Los cupones se agregan a partir de 8:30 a 9:00 a. m.";
    sinCupones.hidden = false;
    todosWrapper.hidden = false;
    estadoCarga.textContent = "";
    return;
  }

  // V81.51 — Estatus automáticos. Se calculan sobre todos los cupones activos
  // para que Tienda, Exclusivo y Bancarios utilicen exactamente las mismas reglas.
  const contextoEtiquetas = crearContextoEtiquetas(disponibles, todosLosCupones);

  if (mostrarTienda) {
    const fragmentoTienda = document.createDocumentFragment();
    cuponesTienda.forEach((cupon, indice) => {
      const etiquetas = etiquetasAutomaticasCupon(cupon, contextoEtiquetas, MAX_ETIQUETAS_CUPON);
      fragmentoTienda.appendChild(crearTarjeta(cupon, etiquetas, indice));
    });
    cuponesContainer.appendChild(fragmentoTienda);
  }

  if (mostrarExclusivos && cuponesExclusivos.length) {
    const fragmentoExclusivos = document.createDocumentFragment();
    cuponesExclusivos.forEach((cupon, indice) => {
      fragmentoExclusivos.appendChild(
        crearTarjeta(
          cupon,
          etiquetasAutomaticasCupon(cupon, contextoEtiquetas, 1),
          cuponesTienda.length + indice
        )
      );
    });
    cuponesContainer.appendChild(fragmentoExclusivos);
  }

  if (mostrarBancarios && cuponesBancarios.length) {
    const fragmentoBancos = document.createDocumentFragment();
    cuponesBancarios.forEach((cupon) => {
      const tarjeta = crearTarjetaBancaria(
        cupon,
        etiquetasAutomaticasCupon(cupon, contextoEtiquetas, MAX_ETIQUETAS_CUPON)
      );
      tarjeta.classList.add("cupon-bancario-grid");
      fragmentoBancos.appendChild(tarjeta);
    });
    cuponesContainer.appendChild(fragmentoBancos);
  }

  // En "Todos", un cupón Nuevo también tiene prioridad GLOBAL durante su primera hora,
  // aunque pertenezca a Tienda, Exclusivo o Bancarios. Al terminar esa hora recupera
  // automáticamente su posición natural dentro de su categoría y por popularidad.
  if (categoriaActiva === "todos" && cuponesContainer) {
    const tarjetas = Array.from(cuponesContainer.children);
    const mapaCupones = new Map(
      todosLosCupones.map((cupon) => [String(cupon.id), cupon])
    );

    tarjetas
      .sort((tarjetaA, tarjetaB) => {
        const cuponA = mapaCupones.get(String(tarjetaA.dataset.id || ""));
        const cuponB = mapaCupones.get(String(tarjetaB.dataset.id || ""));
        if (!cuponA || !cuponB) return 0;

        const agotadoA = cuponA.agotado === true ? 1 : 0;
        const agotadoB = cuponB.agotado === true ? 1 : 0;
        if (agotadoA !== agotadoB) return agotadoA - agotadoB;

        const nuevoA = esCuponNuevo(cuponA) ? 1 : 0;
        const nuevoB = esCuponNuevo(cuponB) ? 1 : 0;
        if (nuevoA !== nuevoB) return nuevoB - nuevoA;

        // Fuera del impulso de una hora no alteramos la agrupación normal por categoría.
        return 0;
      })
      .forEach((tarjeta) => cuponesContainer.appendChild(tarjeta));
  }

  todosWrapper.hidden = false;
  estadoCarga.textContent = "";
  startCouponTimers();
  programarSincronizacionAlturaTarjetas();
}


/* =========================================================
   V81.49.3 — Altura estándar estable
   La altura ya no depende de la tarjeta más alta del momento.
   CSS define una altura exterior común para Tienda, Exclusivo y
   Bancarios; aquí solo limpiamos alturas inline heredadas.
   ========================================================= */
let rafSincronizarAlturaTarjetas = 0;
let timeoutSincronizarAlturaTarjetas = 0;

function obtenerTarjetasVisiblesParaAltura() {
  if (!cuponesContainer) return [];
  return Array.from(
    cuponesContainer.querySelectorAll(
      ':scope > .cupon, :scope > .cupon-bancario-mini, :scope > .cupon-bancario-grid'
    )
  ).filter((tarjeta) => !tarjeta.hidden);
}

function sincronizarAlturaTarjetas() {
  const tarjetas = obtenerTarjetasVisiblesParaAltura();
  tarjetas.forEach((tarjeta) => {
    tarjeta.style.removeProperty('height');
    tarjeta.style.removeProperty('min-height');
    tarjeta.style.removeProperty('max-height');
  });
}

function programarSincronizacionAlturaTarjetas({ incluirSegundoPase = true } = {}) {
  if (rafSincronizarAlturaTarjetas) {
    cancelAnimationFrame(rafSincronizarAlturaTarjetas);
  }
  rafSincronizarAlturaTarjetas = requestAnimationFrame(() => {
    rafSincronizarAlturaTarjetas = 0;
    sincronizarAlturaTarjetas();
  });

  if (incluirSegundoPase) {
    clearTimeout(timeoutSincronizarAlturaTarjetas);
    timeoutSincronizarAlturaTarjetas = window.setTimeout(() => {
      sincronizarAlturaTarjetas();
    }, 180);
  }
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


function firmaEstructuralCupones(cupones = []) {
  return JSON.stringify(
    cupones.map((cupon) => {
      const copia = { ...cupon };
      // likes/clics cambian frecuentemente y no requieren reconstruir tarjetas.
      delete copia.likes;
      delete copia.clics;
      return copia;
    })
  );
}

function actualizarEstadisticasCuponesEnPantalla(cupones = []) {
  if (!cuponesContainer) return;

  const mapa = new Map(cupones.map((cupon) => [String(cupon.id), cupon]));
  cuponesContainer
    .querySelectorAll(".cupon[data-id], .cupon-bancario-mini[data-id]")
    .forEach((tarjeta) => {
      const cupon = mapa.get(String(tarjeta.dataset.id || ""));
      if (!cupon) return;

      const likes = tarjeta.querySelector(".numero-likes");
      const clics = tarjeta.querySelector(".numero-clics");
      if (likes) likes.textContent = String(Number(cupon.likes || 0));
      if (clics) clics.textContent = String(Number(cupon.clics || 0));
    });
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

  if (botonRecargar) botonRecargar.disabled = true;

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
    const nuevosCupones = Array.isArray(cupones) ? cupones : [];
    const nuevaFirmaCupones = firmaEstructuralCupones(nuevosCupones);
    const contenidoCambio = nuevaFirmaCupones !== firmaUltimosCupones;

    todosLosCupones = nuevosCupones;
    actualizarFiltrosBuscadorCupones();

    if (buscadorCuponesResultado && !buscadorCuponesResultado.hidden && Number(buscadorCuponesMonto?.value || 0) > 0) {
      ejecutarBuscadorCupones();
    }

    // Evita vaciar y reconstruir las tarjetas en cada consulta automática.
    // Solo se redibuja la sección cuando la información realmente cambió.
    if (contenidoCambio) {
      firmaUltimosCupones = nuevaFirmaCupones;
      if (esCargaInicial) {
        renderizarCategoria();
      } else {
        renderizarCategoriaConScrollEstable();
      }
    } else {
      // Si únicamente cambiaron likes/clics, actualizamos los números sin
      // destruir ni reconstruir tarjetas. Evita el destello periódico.
      actualizarEstadisticasCuponesEnPantalla(nuevosCupones);
    }

    actualizarContadoresSecciones();
    revisarAvisosNovedades();
    procesarNovedadDesdeUrl();
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
    if (botonRecargar) botonRecargar.disabled = false;
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

function detenerTemporizadorRedireccion() {
  if (temporizadorRedireccion) {
    clearInterval(temporizadorRedireccion);
    temporizadorRedireccion = null;
  }
}

function actualizarTextoBotonRedireccion(segundos) {
  if (!modalContinuar) return;
  modalContinuar.textContent = `Ir a Mercado Libre (${segundos})`;
}

function irAMercadoLibreDesdeModal() {
  const enlace = enlaceWebSeguro(modalContinuar?.dataset.enlace);
  if (!enlace) {
    reiniciarInteraccion();
    return;
  }

  detenerTemporizadorRedireccion();
  finalizarInteraccionCupon();
  window.location.assign(enlace);
}

function iniciarTemporizadorRedireccion() {
  detenerTemporizadorRedireccion();

  let segundos = SEGUNDOS_REDIRECCION_AUTOMATICA;
  actualizarTextoBotonRedireccion(segundos);

  temporizadorRedireccion = window.setInterval(() => {
    segundos -= 1;

    if (segundos <= 0) {
      detenerTemporizadorRedireccion();
      irAMercadoLibreDesdeModal();
      return;
    }

    actualizarTextoBotonRedireccion(segundos);
  }, 1000);
}

function mostrarModal(codigo, mostrarCodigo = true, enlace = "") {
  modalCodigo.textContent = codigo || "";
  modalCodigoBloque.hidden = !mostrarCodigo;
  modalCuponOculto.hidden = mostrarCodigo;

  if (modalContinuar) {
    modalContinuar.dataset.enlace = enlace || "";
    modalContinuar.disabled = !enlace;
  }

  modalRedireccion.hidden = false;
  document.body.style.overflow = "hidden";

  if (enlace) {
    iniciarTemporizadorRedireccion();
  }
}

function cerrarModal() {
  detenerTemporizadorRedireccion();
  modalRedireccion.hidden = true;
  document.body.style.overflow = "";

  if (modalContinuar) {
    modalContinuar.dataset.enlace = "";
    modalContinuar.disabled = false;
    modalContinuar.textContent = "Ir a Mercado Libre";
  }
}

function reiniciarInteraccion() {
  redireccionEnProceso = false;
  cerrarModal();

  document.querySelectorAll(".boton-canjear, .banco-canjear").forEach((boton) => {
    boton.disabled = false;
    boton.innerHTML = contenidoBotonCopiar();
  });

  document.querySelectorAll(".mensaje").forEach((mensaje) => {
    mensaje.textContent = "";
  });
}

function enlaceWebSeguro(enlace) {
  try {
    const destino = new URL(String(enlace || "").trim(), window.location.origin);
    return ["http:", "https:"].includes(destino.protocol) ? destino.toString() : "";
  } catch {
    return "";
  }
}

function finalizarInteraccionCupon() {
  redireccionEnProceso = false;
  cerrarModal();

  document.querySelectorAll(".boton-canjear, .banco-canjear").forEach((boton) => {
    boton.disabled = false;
    boton.innerHTML = contenidoBotonCopiar();
  });
}

modalContinuar?.addEventListener("click", irAMercadoLibreDesdeModal);

modalCancelar?.addEventListener("click", finalizarInteraccionCupon);

async function copiarYCanjear(cupon, tarjeta) {
  if (redireccionEnProceso || !couponTimeState(cupon).enabled) return;

  redireccionEnProceso = true;

  const boton = tarjeta.querySelector(".boton-canjear, .banco-canjear");
  const mensaje = tarjeta.querySelector(".mensaje");
  const numeroClics = tarjeta.querySelector(".numero-clics");
  const usado = tarjeta.querySelector(".cupon-copiado-mini");

  boton.disabled = true;
  boton.textContent = `✅ ${cupon.codigo}`;
  if (mensaje) mensaje.textContent = "Cupón copiado correctamente.";

  const modalTitulo = modalRedireccion?.querySelector("#modal-titulo");
  if (modalTitulo) modalTitulo.textContent = "¡Cupón copiado!";

  const enlaceDestino = enlaceWebSeguro(cupon.enlace);
  if (!enlaceDestino) {
    redireccionEnProceso = false;
    boton.disabled = false;
    boton.innerHTML = contenidoBotonCopiar();
    if (mensaje) mensaje.textContent = "El enlace de compra no es válido.";
    return;
  }

  mostrarModal(cupon.codigo, true, enlaceDestino);

  try {
    await copiarTexto(cupon.codigo);

    localStorage.setItem(claveUsado(cupon.id), "1");
    if (usado) {
      usado.hidden = false;
    }

    registrarClic(cupon.id)
      .then((resultado) => {
        if (Number.isFinite(Number(resultado.clics))) {
          if (numeroClics) numeroClics.textContent = String(resultado.clics);

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

    // El usuario puede salir de inmediato con el botón del modal.
    // Si no interactúa, se redirige automáticamente al terminar la cuenta regresiva.
  } catch (error) {
    console.error(error);
    reiniciarInteraccion();
    if (mensaje) mensaje.textContent = "No fue posible copiar el cupón.";
  }
}

async function compartirPagina(tarjeta) {
  const mensaje = tarjeta.querySelector(".mensaje");
  const texto = "Mira este cupón de descuento publicado en Ofertas Imperdibles MX";

  try {
    if (navigator.share) {
      await navigator.share({
        text: texto,
        url: URL_PAGINA,
      });

      if (mensaje) mensaje.textContent = "Cupón compartido.";
    } else {
      await copiarTexto(`${texto}\n${URL_PAGINA}`);
      if (mensaje) mensaje.textContent = "Enlace del cupón copiado.";
    }

    setTimeout(() => {
      if (mensaje) mensaje.textContent = "";
    }, 3500);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      if (mensaje) mensaje.textContent = "No fue posible compartir la página.";
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



const MARCA_BANNER_CUPONES = "[BANNER_CUPONES]";

function esBannerCupones(publicidad) {
  return String(publicidad?.descripcion || "")
    .trim()
    .startsWith(MARCA_BANNER_CUPONES);
}

function enlaceBannerCupones(publicidad) {
  return String(
    publicidad?.enlace_mercado_libre ||
    publicidad?.enlace ||
    ""
  ).trim();
}

function renderizarBannersCupones() {
  if (!bannersCupones || !bannersCuponesLista) return;

  const items = todasLasPublicidades
    .filter((item) =>
      item?.activo !== false &&
      esBannerCupones(item) &&
      Boolean(item?.imagen_url) &&
      Boolean(enlaceBannerCupones(item))
    )
    .sort((a, b) =>
      (Number(a?.orden) || 0) - (Number(b?.orden) || 0) ||
      (Number(a?.id) || 0) - (Number(b?.id) || 0)
    );

  bannersCuponesLista.replaceChildren();

  if (!items.length) {
    bannersCupones.hidden = true;
    return;
  }

  const fragmento = document.createDocumentFragment();

  for (const item of items) {
    const enlace = document.createElement("a");
    enlace.className = "banner-cupones-enlace";
    enlace.href = enlaceBannerCupones(item);
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.setAttribute(
      "aria-label",
      `Abrir ${item.titulo || "promoción"} en Mercado Libre`
    );

    const imagen = document.createElement("img");
    imagen.src = item.imagen_url;
    imagen.alt = item.titulo || "Promoción de Mercado Libre";
    imagen.loading = "lazy";
    imagen.decoding = "async";

    enlace.appendChild(imagen);
    enlace.addEventListener("click", () => {
      registrarClicPublicidad(item.id);
    });

    fragmento.appendChild(enlace);
  }

  bannersCuponesLista.appendChild(fragmento);
  bannersCupones.hidden = false;
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
  if (seccion === "banners_cupones") {
    return esBannerCupones(publicidad);
  }

  if (esBannerCupones(publicidad)) {
    return false;
  }

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
    renderizarBannersCupones();
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


function obtenerFilaControlesSecundarios() {
  const contenedor = document.querySelector(".hero-redes-botones");
  if (!contenedor) return null;

  let fila = contenedor.querySelector(".hero-controles-secundarios");
  if (!fila) {
    fila = document.createElement("div");
    fila.className = "hero-controles-secundarios";
    contenedor.appendChild(fila);
  }
  return fila;
}

function crearControlesAvisosNovedades() {
  if (document.querySelector("#boton-avisos-novedades")) return;

  const contenedor = document.querySelector(".hero-redes-botones");
  if (!contenedor) return;
  const filaControles = obtenerFilaControlesSecundarios();
  if (!filaControles) return;

  const boton = document.createElement("button");
  boton.id = "boton-avisos-novedades";
  boton.type = "button";
  boton.className = "boton-avisos-novedades";
  boton.innerHTML = `
    <span class="avisos-campana" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M16 4.5c-4.2 0-7 3.3-7 7.5v4.2c0 1.9-.7 3.8-2 5.3l-1.1 1.2h20.2L25 21.5c-1.3-1.5-2-3.4-2-5.3V12c0-4.2-2.8-7.5-7-7.5Z"/>
        <path d="M12.4 24.4a3.8 3.8 0 0 0 7.2 0"/>
      </svg>
      <span class="avisos-badge">1</span>
    </span>
    <span class="avisos-switch" aria-hidden="true"><span class="avisos-switch-knob"></span></span>
  `;
  boton.setAttribute("aria-pressed", "false");
  filaControles.appendChild(boton);

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
  boton.setAttribute("aria-pressed", activos ? "true" : "false");
  boton.setAttribute("aria-label", activos ? "Desactivar avisos" : "Activar avisos");
  boton.title = activos
    ? "Avisos activados. Toca para desactivarlos."
    : "Activa avisos de nuevos cupones y productos Anirona";

  if (typeof actualizarTextoAvisosMenuMas === "function") actualizarTextoAvisosMenuMas();
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
    tutorialActivo ||
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
    tutorialActivo ||
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
cargarVisitasResumen();
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
function render(e){currentEvent=e;winnerHero(e);if(!root)return;if(!e){root.innerHTML='<div class="evento-estado-vacio"><strong>🎁 Próximamente habrá una nueva dinámica.</strong><p>Mantente pendiente de Comunidad Anirona.</p></div>';return;}const pct=Math.min(100,Math.round((e.participantes_count/e.limite_boletos)*100));const open=e.estado==='abierta'&&e.disponibles>0;const winners=(e.ganadores||[]).map(w=>`<div class="evento-ganador"><span>🏆 Ganador${w.posicion>1?' '+w.posicion:''}</span><strong>${formatNo(w.numero)}</strong><span>${esc(w.nombre_parcial)}</span></div>`).join('');root.innerHTML=`<article class="evento-card"><div class="evento-portada">${e.imagen_url?`<img class="evento-imagen" src="${esc(e.imagen_url)}" alt="${esc(e.producto_nombre)}">`:'<div class="evento-imagen"></div>'}<div class="evento-info"><span class="evento-etiqueta">${esc(e.tipo)}</span><h3>${esc(e.nombre)}</h3><p class="evento-producto">🎁 ${esc(e.producto_nombre)}</p>${e.premio_enlace?`<div class="evento-premio-enlace"><span><strong>🏆 Premio</strong><small>${esc(e.premio_plataforma||'Ver producto')}</small></span><a id="evento-premio-btn" class="evento-boton evento-premio-boton" href="${esc(e.premio_enlace)}" target="_blank" rel="noopener noreferrer" data-cupon="${esc(e.premio_cupon||'')}">🛒 Conocer el premio</a></div>`:''}<p class="evento-descripcion">${esc(e.descripcion)}</p>${e.fecha_sorteo?`<p class="evento-fecha">📅 Sorteo: ${esc(dateText(e.fecha_sorteo))}</p>`:''}${e.mostrar_contador?`<div class="evento-progreso"><div class="evento-progreso-texto"><strong>${e.participantes_count} participantes</strong><span>${e.disponibles} disponibles</span></div><div class="evento-progreso-barra"><span style="width:${pct}%"></span></div></div>`:''}${winners}${open?`<form id="evento-form" class="evento-form-grid"><div class="evento-campo evento-campo-completo"><label>Nombre completo</label><input name="nombre" required maxlength="100" autocomplete="name"></div><div class="evento-campo"><label>Teléfono</label><input name="telefono" required inputmode="numeric" maxlength="14" autocomplete="tel"></div><div class="evento-campo"><label>Ciudad (opcional)</label><input name="ciudad" maxlength="80" autocomplete="address-level2"></div><label class="evento-privacidad evento-campo-completo"><input name="privacidad" type="checkbox" required> <span>Acepto que mis datos se utilicen únicamente para administrar esta dinámica y contactar a las personas ganadoras.</span></label><button class="evento-boton evento-campo-completo" type="submit">Registrarme y obtener mi número</button></form>`:`<div class="evento-resultado"><strong>${e.estado==='finalizada'?'Esta dinámica ha finalizado.':'Los registros están cerrados.'}</strong></div>`}<div class="evento-consulta"><strong>Consultar mi registro</strong><div class="evento-consulta-fila evento-campo"><input id="evento-consulta-tel" inputmode="numeric" maxlength="14" placeholder="Teléfono de 10 dígitos"><button id="evento-consulta-btn" class="evento-boton evento-secundario" type="button">Buscar</button></div></div></div></div></article>`;countdown(e.fecha_sorteo,document.querySelector('#evento-cuenta'));document.querySelector('#evento-form')?.addEventListener('submit',register);document.querySelector('#evento-consulta-btn')?.addEventListener('click',lookup);document.querySelector('#evento-premio-btn')?.addEventListener('click',ev=>{const cup=ev.currentTarget.dataset.cupon;if(cup&&navigator.clipboard){navigator.clipboard.writeText(cup).then(()=>{const original=ev.currentTarget.textContent;ev.currentTarget.textContent=`✓ Cupón ${cup} copiado`;setTimeout(()=>ev.currentTarget.textContent=original,2200)}).catch(()=>{});}});}
function enfocarRegistroDesdeUrl(){
  const params=new URLSearchParams(window.location.search);
  if(String(params.get('sorteo')||'').toLowerCase()!=='registro')return;
  const target=document.querySelector('#evento-form')||root?.querySelector('.evento-card');
  if(!target)return;
  // El parámetro solo sirve para la llegada inicial. Se limpia de inmediato
  // para que actualizar la página no vuelva a enviar al formulario.
  const urlLimpia=new URL(window.location.href);
  urlLimpia.searchParams.delete('sorteo');
  urlLimpia.searchParams.set('seccion','anirona');
  window.history.replaceState({seccion:'anirona'},'',urlLimpia);
  window.setTimeout(()=>{
    target.scrollIntoView({behavior:'smooth',block:'center'});
    target.classList.add('evento-destacado-url');
    document.querySelector('#evento-form input[name="nombre"]')?.focus({preventScroll:true});
    window.setTimeout(()=>target.classList.remove('evento-destacado-url'),5000);
  },350);
}

function resultHtml(p){const share=`🎉 Ya estoy participando en ${currentEvent.nombre}. Mi número es ${formatNo(p.numero)} (${p.codigo}).`;return `<div id="evento-comprobante-print" class="evento-resultado"><strong>✅ ¡Registro exitoso!</strong><span>Tu número de participante es</span><span class="evento-numero">${formatNo(p.numero)}</span><span class="evento-codigo">${esc(p.codigo)}</span><img alt="Código QR del participante" width="150" height="150" src="https://quickchart.io/qr?size=180&text=${encodeURIComponent(p.codigo)}"><div class="evento-acciones"><a class="evento-boton" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(share)}">Compartir por WhatsApp</a><button class="evento-boton evento-secundario" onclick="window.print()" type="button">Guardar comprobante</button></div></div>`;}
async function register(ev){ev.preventDefault();const f=ev.currentTarget,m=f.querySelector('#evento-mensaje'),btn=f.querySelector('button');m.textContent='Registrando…';m.classList.remove('error');btn.disabled=true;try{const fd=new FormData(f);const p=await api('/api/cupones?action=eventos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({evento_id:currentEvent.id,nombre:fd.get('nombre'),telefono:fd.get('telefono'),ciudad:fd.get('ciudad'),acepta_privacidad:fd.get('privacidad')==='on'})});f.outerHTML=resultHtml(p);}catch(e){m.textContent=e.message;m.classList.add('error');btn.disabled=false;}}
async function lookup(){const input=document.querySelector('#evento-consulta-tel'),msg=document.querySelector('#evento-consulta-msg');msg.textContent='Buscando…';msg.classList.remove('error');try{const p=await api(`/api/cupones?action=eventos-consulta&evento_id=${currentEvent.id}&telefono=${encodeURIComponent(input.value)}`);msg.innerHTML=`✅ ${esc(p.nombre)} · Número <strong>${formatNo(p.numero)}</strong> · ${esc(p.codigo)}`;}catch(e){msg.textContent=e.message;msg.classList.add('error');}}
async function load(){try{const d=await api('/api/cupones?action=eventos');render(d.evento);enfocarRegistroDesdeUrl();}catch(e){if(root)root.innerHTML=`<div class="evento-estado-vacio">${esc(e.message)}</div>`;}}
load();

}


// Las etiquetas del administrador no cambian el contenido de los cupones.
// Evitamos volver a renderizar las tarjetas al terminar de cargar la configuración,
// ya que eso provocaba un segundo parpadeo durante la carga inicial.
document.addEventListener("ofertas:etiquetas-cargadas", () => {
  document.querySelectorAll(".cupon[data-id]:not(.cupon-bancario)").forEach((tarjeta) => {
    const cupon = todosLosCupones.find((item) => Number(item.id) === Number(tarjeta.dataset.id));
    if (!cupon) return;
    const visual = configuracionVisualCupon(cupon);
    tarjeta.style.setProperty("--categoria-cupon-color", visual.color);
    tarjeta.style.setProperty("--categoria-cupon-texto", colorTextoContraste(visual.color));
    const franja = tarjeta.querySelector(".franja-categoria-cupon");
    if (franja) franja.textContent = visual.nombre;
  });
  actualizarContadoresSecciones();
});


/* ================= TUTORIAL DE CUPONES V77.11.3 LTS ================= */
const CLAVE_TUTORIAL_COMPLETADO = "oi-tutorial-cupones-v77-11-completado";
let tutorialActivo = false;
let tutorialPasoActual = 0;
let tutorialElementos = null;
let tutorialCuponObjetivo = null;
let tutorialCuponEsEjemplo = false;
let tutorialEstadoVista = null;

const esperarTutorial = (ms = 400) => new Promise((resolve) => window.setTimeout(resolve, ms));

function crearBotonTutorial() {
  if (document.querySelector("#boton-ver-tutorial")) return;
  const contenedor = document.querySelector(".hero-redes-botones");
  if (!contenedor) return;
  const filaControles = obtenerFilaControlesSecundarios();
  if (!filaControles) return;
  const boton = document.createElement("button");
  boton.id = "boton-ver-tutorial";
  boton.type = "button";
  boton.className = "boton-ver-tutorial";
  boton.innerHTML = `
    <span class="tutorial-icono" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <circle cx="16" cy="16" r="12.5"/>
        <path d="M13 10.5 22 16l-9 5.5z"/>
      </svg>
    </span>
    <span class="tutorial-texto">Ver tutorial</span>
  `;
  boton.title = "Aprende a utilizar los cupones";
  boton.addEventListener("click", () => iniciarTutorialGuiado(false));
  const botonAvisos = filaControles.querySelector("#boton-avisos-novedades");
  if (botonAvisos) filaControles.insertBefore(boton, botonAvisos);
  else filaControles.appendChild(boton);
}

function crearCuponEjemploTutorial() {
  const visualCategoria = configuracionVisualCategoria("tienda");
  const articulo = document.createElement("article");
  articulo.id = "tutorial-cupon-ejemplo";
  articulo.className = "cupon tutorial-cupon-demo";
  articulo.dataset.color = "0";
  articulo.setAttribute("aria-label", "Cupón de ejemplo para el tutorial");
  articulo.innerHTML = `
    <div class="franja-categoria-cupon">${escaparHtml(visualCategoria.nombre)}</div>
    <div class="cupon-encabezado">
      <h2 class="descuento">10% de descuento</h2>
    </div>
    <div class="cupon-contenido">
      <div class="cupon-etiquetas"><span class="etiqueta-cupon etiqueta-nuevo">✨ Nuevo</span></div>
      <div class="condiciones-cupon">
        <p class="condicion-cupon condicion-compra">En compras desde <strong>$1,000</strong></p>
        <p class="condicion-cupon condicion-ahorro">Ahorra hasta <strong>$250</strong></p>
      </div>
      <div class="estado-programacion" hidden></div>
      <div class="acciones-bloque">
        <div class="acciones-cupon">
          <button class="boton-canjear" type="button" tabindex="-1">${contenidoBotonCopiar()}</button>
        </div>
        <div class="acciones-secundarias">
          <button class="boton-like" type="button" tabindex="-1" aria-label="Me gusta">${iconoMeGusta()}</button>
          <button class="boton-compartir" type="button" tabindex="-1" aria-label="Compartir">${iconoCompartir()}</button>
          <div class="estadisticas-cupon">
            <span class="estadistica-item estadistica-likes">${iconoMeGusta()} <span>325</span></span>
            <span class="estadistica-item estadistica-usos">${iconoCopias()} <span>1,245</span></span>
          </div>
        </div>
      </div>
    </div>
    <span class="tutorial-ejemplo-aviso">Ejemplo visual</span>
  `;
  articulo.addEventListener("click", (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
  });
  return articulo;
}

function guardarEstadoVistaTutorial() {
  if (tutorialEstadoVista) return;
  tutorialEstadoVista = {
    todosWrapperHidden: todosWrapper?.hidden,
    sinCuponesHidden: sinCupones?.hidden,
    estadoCargaHidden: estadoCarga?.hidden,
  };
}

function restaurarEstadoVistaTutorial() {
  if (!tutorialEstadoVista) return;
  if (todosWrapper) todosWrapper.hidden = tutorialEstadoVista.todosWrapperHidden;
  if (sinCupones) sinCupones.hidden = tutorialEstadoVista.sinCuponesHidden;
  if (estadoCarga) estadoCarga.hidden = tutorialEstadoVista.estadoCargaHidden;
  tutorialEstadoVista = null;
}

function limpiarCuponTutorial() {
  if (tutorialCuponObjetivo) tutorialCuponObjetivo.classList.remove("tutorial-cupon-objetivo");
  if (tutorialCuponEsEjemplo) document.querySelector("#tutorial-cupon-ejemplo")?.remove();
  tutorialCuponObjetivo = null;
  tutorialCuponEsEjemplo = false;
  cuponesContainer?.classList.remove("tutorial-grid-con-ejemplo");
  restaurarEstadoVistaTutorial();
}

async function prepararCuponTutorial() {
  tabTienda?.click();
  await esperarTutorial(450);
  limpiarCuponTutorial();

  const cuponReal = cuponesContainer?.querySelector(".cupon:not(.tutorial-cupon-demo)");
  if (cuponReal) {
    tutorialCuponObjetivo = cuponReal;
    tutorialCuponEsEjemplo = false;
  } else if (cuponesContainer) {
    guardarEstadoVistaTutorial();
    if (todosWrapper) todosWrapper.hidden = false;
    if (sinCupones) sinCupones.hidden = true;
    if (estadoCarga) estadoCarga.hidden = true;
    tutorialCuponObjetivo = crearCuponEjemploTutorial();
    tutorialCuponEsEjemplo = true;
    cuponesContainer.classList.add("tutorial-grid-con-ejemplo");
    cuponesContainer.appendChild(tutorialCuponObjetivo);
  }

  tutorialCuponObjetivo?.classList.add("tutorial-cupon-objetivo");
  tutorialCuponObjetivo?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  await esperarTutorial(500);
}

function objetivoDentroCupon(selectorInterno) {
  return () => {
    if (!tutorialCuponObjetivo || !tutorialCuponObjetivo.isConnected) return null;
    return selectorInterno ? tutorialCuponObjetivo.querySelector(selectorInterno) : tutorialCuponObjetivo;
  };
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
    texto: "Te mostraremos paso a paso cómo encontrar, entender, copiar y compartir los cupones para aprovecharlos a tiempo.",
    icono: "👋",
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      window.scrollTo({ top: 0, behavior: "auto" });
      await esperarTutorial(80);
    },
  },
  {
    selector: "#tab-todos",
    titulo: "Todos",
    texto: "Esta es la vista principal. Aquí puedes consultar en un solo lugar los cupones disponibles de las diferentes secciones.",
    icono: "▦",
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      tabTodos?.click();
      await esperarTutorial(350);
    },
  },
  {
    selector: "#tab-tienda",
    titulo: "Tienda",
    texto: "Aquí encontrarás los cupones generales que pueden aplicar en todo Mercado Libre, siempre de acuerdo con las condiciones y restricciones indicadas en cada cupón.",
    icono: "🛍️",
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      tabTienda?.click();
      await esperarTutorial(350);
    },
  },
  {
    selector: "#tab-bancarios",
    titulo: "Bancarios",
    texto: "Aquí se muestran descuentos y beneficios vinculados a bancos, tarjetas o métodos de pago participantes. Revisa las condiciones de cada promoción antes de comprar.",
    icono: "💳",
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      tabBancarios?.click();
      await esperarTutorial(350);
    },
  },
  {
    selector: "#tab-exclusivo",
    titulo: "Exclusivos",
    texto: "Son códigos especiales de descuento o beneficios personalizados que Mercado Libre o sus marcas asociadas pueden otorgar a ciertos usuarios, productos o promociones.",
    icono: "🎟️",
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      if (tabExclusivo) tabExclusivo.hidden = false;
      tabExclusivo?.click();
      await esperarTutorial(350);
    },
  },
  {
    objetivo: objetivoDentroCupon(null),
    cupon: true,
    titulo: "Información del cupón",
    texto: "Cada tarjeta te muestra la información importante del cupón, como descuento, compra mínima, ahorro máximo, vigencia y etiquetas especiales.",
    icono: "🔎",
  },
  {
    objetivo: objetivoDentroCupon(".boton-canjear"),
    cupon: true,
    titulo: "Copiar código",
    texto: "Este botón copia el código y te lleva a Mercado Libre. Después debes ingresar ese código en el apartado de cupones, desde la opción “Ingresar código”, para intentar aplicarlo a tu compra.",
    icono: "📋",
  },
  {
    objetivo: objetivoDentroCupon(".boton-like"),
    cupon: true,
    titulo: "Me gusta",
    texto: "Si un cupón te resulta útil, marca Me gusta. Esto ayuda a la comunidad a identificar las oportunidades que están funcionando mejor.",
    icono: "👍",
  },
  {
    objetivo: objetivoDentroCupon(".boton-compartir"),
    cupon: true,
    titulo: "Compartir",
    texto: "Comparte rápidamente el cupón con familiares o amigos para que también puedan aprovechar el descuento antes de que termine.",
    icono: "🔗",
  },
  {
    selector: "#menu-mas-avisos",
    titulo: "Activa los avisos",
    texto: "Desde el botón Más puedes encontrar Notificaciones. Actívalas para recibir avisos cuando publiquemos nuevos cupones y oportunidades.",
    icono: "🔔",
    preparar: async () => {
      limpiarCuponTutorial();
      window.scrollTo({ top: 0, behavior: "auto" });
      await esperarTutorial(80);
      const panel = document.querySelector("#menu-mas-panel");
      const boton = document.querySelector("#boton-mas-flotante");
      if (panel && boton) {
        panel.hidden = false;
        boton.setAttribute("aria-expanded", "true");
        document.querySelector("#menu-mas-flotante")?.classList.add("abierto");
      }
      await esperarTutorial(180);
    },
  },
  {
    selector: "#whatsapp-flotante",
    titulo: "Únete al canal de WhatsApp",
    texto: "Usa esta cápsula para entrar a nuestro canal de WhatsApp y recibir promociones, cupones y novedades de Ofertas Imperdibles MX.",
    icono: "📲",
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      window.scrollTo({ top: 0, behavior: "auto" });
      await esperarTutorial(80);
      actualizarEstadoWhatsappFlotante?.();
      await esperarTutorial(160);
    },
  },
  {
    titulo: "¡Listo para ahorrar!",
    texto: "Ya conoces las funciones principales. Revisa los cupones, consulta sus condiciones y aprovéchalos a tiempo. Puedes repetir este tutorial cuando quieras desde el botón Más.",
    icono: "🎉",
    finalizarEnTienda: true,
    preparar: async () => {
      cerrarMenuMasFlotante?.();
      await esperarTutorial(80);
    },
  },
];

function obtenerObjetivoTutorial(paso) {
  if (typeof paso?.objetivo === "function") return paso.objetivo();
  return paso?.selector ? document.querySelector(paso.selector) : null;
}

function posicionarTutorial(paso) {
  if (!tutorialActivo || !tutorialElementos) return;
  const objetivo = obtenerObjetivoTutorial(paso);
  const { foco, tarjeta } = tutorialElementos;
  const anchoTarjeta = Math.min(360, window.innerWidth - 24);
  tarjeta.classList.toggle("tutorial-cupon-activo", Boolean(paso?.cupon));
  tarjeta.style.width = `${anchoTarjeta}px`;
  if (!objetivo) {
    foco.hidden = true;
    tarjeta.classList.remove("tutorial-superior");
    tarjeta.classList.add("tutorial-centrada");
    tarjeta.style.left = "50%";
    tarjeta.style.top = "50%";
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
  tarjeta.style.removeProperty("bottom");

  if (paso?.cupon) {
    tarjeta.classList.add("tutorial-superior");
    tarjeta.style.left = `${Math.max(12, (window.innerWidth - anchoTarjeta) / 2)}px`;
    tarjeta.style.top = "12px";
    return;
  }

  tarjeta.classList.remove("tutorial-superior");
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
  if (paso.cupon && (!tutorialCuponObjetivo || !tutorialCuponObjetivo.isConnected)) {
    try { await prepararCuponTutorial(); } catch (error) { console.warn("No fue posible preparar el cupón del tutorial.", error); }
  }
  if (typeof paso.preparar === "function") {
    try { await paso.preparar(); } catch (error) { console.warn("No fue posible preparar un paso del tutorial.", error); }
  }
  let objetivo = obtenerObjetivoTutorial(paso);
  if (objetivo) {
    objetivo.scrollIntoView({
      behavior: "smooth",
      block: paso.cupon ? "end" : "center",
      inline: "center",
    });
    await esperarTutorial(420);
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
  const ui = crearInterfazTutorial();
  ui.foco.hidden = true;
  ui.tarjeta.hidden = true;
  ui.tarjeta.classList.remove("tutorial-superior", "tutorial-cupon-activo");
  ui.tarjeta.classList.add("tutorial-centrada");
  ui.tarjeta.style.left = "50%";
  ui.tarjeta.style.top = "50%";
  ui.tarjeta.style.removeProperty("bottom");
  window.scrollTo({ top: 0, behavior: "auto" });
  window.requestAnimationFrame(() => mostrarPasoTutorial(0));
  if (!automatico) localStorage.setItem(CLAVE_TUTORIAL_COMPLETADO, "1");
}

function finalizarTutorialGuiado(completado = false, irATienda = false) {
  tutorialActivo = false;
  document.documentElement.classList.remove("tutorial-en-curso");
  cerrarMenuMasFlotante?.();
  limpiarCuponTutorial();
  if (tutorialElementos) {
    tutorialElementos.foco.hidden = true;
    tutorialElementos.tarjeta.hidden = true;
  }
  if (completado) localStorage.setItem(CLAVE_TUTORIAL_COMPLETADO, "1");
  if (typeof actualizarContadoresSecciones === "function") actualizarContadoresSecciones();
  if (irATienda) {
    // Al terminar el tutorial regresamos a la vista principal: Todos.
    tabTodos?.click();
    window.setTimeout(() => {
      document.querySelector(".selector-cupones-oscuro")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 200);
  }
}

function resaltarBotonTutorialAlEntrar() {
  const boton = document.querySelector("#boton-ver-tutorial");
  if (!boton || boton.classList.contains("tutorial-boton-destacado")) return;

  boton.classList.add("tutorial-boton-destacado");
  window.setTimeout(() => boton.classList.remove("tutorial-boton-destacado"), 6500);
}

crearBotonTutorial();
window.setTimeout(() => {
  crearBotonTutorial();
  resaltarBotonTutorialAlEntrar();
}, 1200);


/* ============================================================
   V82.13 — Contraer WhatsApp flotante al desplazarse
   ============================================================ */
function actualizarEstadoWhatsappFlotante() {
  const boton = document.querySelector("#whatsapp-flotante");
  if (!boton) return;

  // Arriba se muestra como cápsula; al iniciar el desplazamiento queda circular.
  const expandido = window.scrollY <= 12;
  boton.classList.toggle("whatsapp-flotante-expandido", expandido);
}

window.addEventListener("scroll", actualizarEstadoWhatsappFlotante, { passive: true });
window.addEventListener("pageshow", actualizarEstadoWhatsappFlotante);
document.addEventListener("DOMContentLoaded", actualizarEstadoWhatsappFlotante);
actualizarEstadoWhatsappFlotante();


/* ============================================================
   V82.23 — Ajuste automático del tamaño del título
   ============================================================ */
function ajustarTamanoTituloHero() {
  const titulo = document.querySelector("#nombre-sitio");
  if (!titulo) return;

  const contenedor = titulo.parentElement;
  if (!contenedor) return;

  // Tamaños base aprobados.
  const esMovil = window.matchMedia("(max-width: 600px)").matches;
  const esMuyAngosto = window.matchMedia("(max-width: 380px)").matches;
  const base = esMuyAngosto ? 13 : (esMovil ? 14 : 16);
  const minimo = esMuyAngosto ? 10.5 : (esMovil ? 11 : 12);

  titulo.style.fontSize = `${base}px`;

  const anchoDisponible = titulo.getBoundingClientRect().width;
  if (!anchoDisponible) return;

  let size = base;

  // scrollWidth refleja el ancho real del texto en una sola línea.
  while (titulo.scrollWidth > titulo.clientWidth && size > minimo) {
    size -= 0.25;
    titulo.style.fontSize = `${size}px`;
  }
}

window.addEventListener("resize", ajustarTamanoTituloHero);
window.addEventListener("pageshow", ajustarTamanoTituloHero);
document.addEventListener("DOMContentLoaded", ajustarTamanoTituloHero);

// También reajusta tras cargar configuración dinámica del encabezado.
document.addEventListener("ofertas:configuracion-cargada", ajustarTamanoTituloHero);

window.setTimeout(ajustarTamanoTituloHero, 0);


/* ============================================================
   V82.27 — Menú flotante "Más"
   Reutiliza Tutorial y Notificaciones existentes.
   ============================================================ */
function actualizarTextoAvisosMenuMas() {
  const texto = document.querySelector("#menu-mas-avisos-texto");
  const boton = document.querySelector("#menu-mas-avisos");
  if (!texto || !boton) return;

  const activos =
    typeof avisosNovedadesActivos === "function" && avisosNovedadesActivos();

  texto.textContent = activos ? "Avisos activados" : "Notificaciones";
  boton.classList.toggle("activo", Boolean(activos));
}

function cerrarMenuMasFlotante() {
  const panel = document.querySelector("#menu-mas-panel");
  const boton = document.querySelector("#boton-mas-flotante");
  if (!panel || !boton) return;

  panel.hidden = true;
  boton.setAttribute("aria-expanded", "false");
  document.querySelector("#menu-mas-flotante")?.classList.remove("abierto");
}

function inicializarMenuMasFlotante() {
  const contenedor = document.querySelector("#menu-mas-flotante");
  const panel = document.querySelector("#menu-mas-panel");
  const boton = document.querySelector("#boton-mas-flotante");
  const tutorial = document.querySelector("#menu-mas-tutorial");
  const avisos = document.querySelector("#menu-mas-avisos");

  if (!contenedor || !panel || !boton || !tutorial || !avisos) return;

  actualizarTextoAvisosMenuMas();

  boton.addEventListener("click", (event) => {
    event.stopPropagation();
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    boton.setAttribute("aria-expanded", abrir ? "true" : "false");
    contenedor.classList.toggle("abierto", abrir);
  });

  tutorial.addEventListener("click", () => {
    cerrarMenuMasFlotante();
    if (typeof iniciarTutorialGuiado === "function") {
      iniciarTutorialGuiado(false);
    }
  });

  avisos.addEventListener("click", async () => {
    if (typeof activarAvisosNovedades === "function") {
      await activarAvisosNovedades();
      actualizarTextoAvisosMenuMas();
    }
  });

  document.addEventListener("click", (event) => {
    if (!contenedor.contains(event.target)) cerrarMenuMasFlotante();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cerrarMenuMasFlotante();
  });
}

document.addEventListener("DOMContentLoaded", inicializarMenuMasFlotante);
document.addEventListener("visibilitychange", actualizarTextoAvisosMenuMas);
