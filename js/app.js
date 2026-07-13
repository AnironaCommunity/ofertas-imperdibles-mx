const cuponesContainer = document.querySelector("#cupones");
const todosWrapper = document.querySelector("#todos-wrapper");
const sinCupones = document.querySelector("#sin-cupones");
const estadoCarga = document.querySelector("#estado-carga");
const botonRecargar = document.querySelector("#boton-recargar");
const contadorActualizacion = document.querySelector("#contador-actualizacion");

const modalRedireccion = document.querySelector("#modal-redireccion");
const modalContador = document.querySelector("#modal-contador");
const cronometroNumero = document.querySelector("#cronometro-numero");
const modalCodigo = document.querySelector("#modal-codigo");
const modalCodigoBloque = document.querySelector("#modal-codigo-bloque");
const modalCuponOculto = document.querySelector("#modal-cupon-oculto");

const tabTienda = document.querySelector("#tab-tienda");
const tabBancarios = document.querySelector("#tab-bancarios");


const carruselesPublicidad = [];

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
let todosLosCupones = [];
let todasLasPublicidades = [];
let temporizadorEstados = null;

botonRecargar.addEventListener("click", cargarCupones);
tabTienda.addEventListener("click", () => cambiarCategoria("tienda"));
tabBancarios.addEventListener("click", () => cambiarCategoria("bancarios"));

document.querySelectorAll(".menu-ofertas a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const destino = document.querySelector(enlace.getAttribute("href"));
    if (destino) destino.hidden = false;
  });
});

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
  let needsReload = false;

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
      needsReload = true;
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

  if (needsReload && !cargando && !redireccionEnProceso) {
    cargarCupones();
  }
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

function crearTarjeta(cupon, esPopular = false, indice = 0) {
  const articulo = document.createElement("article");
  const yaUsado = localStorage.getItem(claveUsado(cupon.id)) === "1";
  const yaLeGusta = localStorage.getItem(claveLike(cupon.id)) === "1";

  articulo.className = esPopular ? "cupon popular" : "cupon";
  articulo.dataset.id = String(cupon.id);
  articulo.dataset.color = COLORES[indice % COLORES.length];

  articulo.innerHTML = `
    <div class="cupon-encabezado">
      <h2 class="descuento">${escaparHtml(cupon.titulo)}</h2>
      
    </div>

    <div class="cupon-contenido">
      <div class="cupon-etiquetas">
        ${esPopular
          ? '<span class="etiqueta-popular-integrada">🔥 Popular</span>'
          : ""}
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

function cambiarCategoria(categoria) {
  categoriaActiva = categoria;

  const esTienda = categoria === "tienda";

  tabTienda.classList.toggle("activo", esTienda);
  tabBancarios.classList.toggle("activo", !esTienda);

  tabTienda.setAttribute("aria-pressed", String(esTienda));
  tabBancarios.setAttribute("aria-pressed", String(!esTienda));

  renderizarCategoria();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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

  cuponesCategoria.forEach((cupon, indice) => {
    fragmento.appendChild(
      crearTarjeta(
        cupon,
        indice === 0 &&
          couponTimeState(cupon).enabled &&
          Number(cupon.clics || 0) > 0,
        indice
      )
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
  estadoCarga.className = "estado-carga";
  estadoCarga.textContent = "Cargando cupones...";
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
  } catch (error) {
    console.error(error);
    limpiarVista();

    estadoCarga.className = "estado-carga error";
    estadoCarga.textContent =
      "No pudimos cargar los cupones. Intenta actualizar la página.";
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
  document.querySelectorAll("[data-categoria-publicidad]").forEach((wrapper) => {
    carruselesPublicidad.push(crearControlCarrusel(wrapper));
  });
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

    for (const control of carruselesPublicidad) {
      control.items = todasLasPublicidades.filter((item) =>
        (item.categoria || "ofertas_dia") === control.categoria
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

  const esAmazon = control.categoria === "ofertas_amazon";
  control.enlace.textContent = esAmazon ? "📦 Ver en Amazon" : "🛒 Ver en Mercado Libre";
  if (control.avisoCupon) {
    control.avisoCupon.innerHTML = esAmazon
      ? '📋 Al dar clic en <strong>Ver en Amazon</strong>, el cupón se copiará automáticamente.'
      : '📋 Al dar clic en <strong>Ver en Mercado Libre</strong>, el cupón se copiará automáticamente.';
  }

  const precioPublicado = String(publicidad.precio_publicado || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  control.bloquePublicado.hidden = !precioPublicado;
  control.bloqueCupon.hidden = !precioCupon;
  control.avisoCupon.hidden = !precioCupon;
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
    if (precioCupon && codigo) await copiarTexto(codigo);
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

inicializarCarruselesPublicidad();
cargarCupones();
cargarPublicidad();
