const cuponesContainer = document.querySelector("#cupones");
const popularContainer = document.querySelector("#cupon-popular");
const popularWrapper = document.querySelector("#popular-wrapper");
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

const publicidadWrapper = document.querySelector("#publicidad-wrapper");
const publicidadCarrusel = document.querySelector("#publicidad-carrusel");
const publicidadContenido = document.querySelector("#publicidad-contenido");
const publicidadImagen = document.querySelector("#publicidad-imagen");
const publicidadTitulo = document.querySelector("#publicidad-titulo");
const publicidadDescripcion = document.querySelector("#publicidad-descripcion");
const publicidadEnlace = document.querySelector("#publicidad-enlace");
const publicidadPrecioPublicado = document.querySelector("#publicidad-precio-publicado");
const publicidadPrecioCupon = document.querySelector("#publicidad-precio-cupon");
const precioPublicadoBloque = document.querySelector("#precio-publicado-bloque");
const precioCuponBloque = document.querySelector("#precio-cupon-bloque");
const publicidadAvisoCupon = document.querySelector("#publicidad-aviso-cupon");
const publicidadIndicadores = document.querySelector("#publicidad-indicadores");
const publicidadAnterior = document.querySelector("#publicidad-anterior");
const publicidadSiguiente = document.querySelector("#publicidad-siguiente");

const SEGUNDOS_ACTUALIZACION = 60;
const SEGUNDOS_REDIRECCION = 3;
const MILISEGUNDOS_PUBLICIDAD = 8000;
const COLORES = ["turquesa", "azul", "morado", "coral", "oliva"];

let segundosRestantes = SEGUNDOS_ACTUALIZACION;
let cargando = false;
let redireccionEnProceso = false;
let timeoutRedireccion = null;
let categoriaActiva = "tienda";
let todosLosCupones = [];

let publicidades = [];
let publicidadActual = 0;
let temporizadorPublicidad = null;
let inicioSwipeX = null;

botonRecargar.addEventListener("click", cargarCupones);
tabTienda.addEventListener("click", () => cambiarCategoria("tienda"));
tabBancarios.addEventListener("click", () => cambiarCategoria("bancarios"));

publicidadAnterior.addEventListener("click", () => cambiarPublicidad(-1));
publicidadSiguiente.addEventListener("click", () => cambiarPublicidad(1));

publicidadCarrusel.addEventListener("mouseenter", detenerRotacionPublicidad);
publicidadCarrusel.addEventListener("mouseleave", iniciarRotacionPublicidad);
publicidadCarrusel.addEventListener("focusin", detenerRotacionPublicidad);
publicidadCarrusel.addEventListener("focusout", iniciarRotacionPublicidad);

publicidadCarrusel.addEventListener("touchstart", (event) => {
  inicioSwipeX = event.touches[0]?.clientX ?? null;
}, { passive: true });

publicidadCarrusel.addEventListener("touchend", (event) => {
  if (inicioSwipeX === null) return;

  const finX = event.changedTouches[0]?.clientX ?? inicioSwipeX;
  const diferencia = finX - inicioSwipeX;

  if (Math.abs(diferencia) >= 45) {
    cambiarPublicidad(diferencia > 0 ? -1 : 1);
  }

  inicioSwipeX = null;
}, { passive: true });

publicidadEnlace.addEventListener("click", (event) => {
  event.preventDefault();

  const publicidad = publicidades[publicidadActual];

  if (publicidad) {
    abrirPublicidad(publicidad);
  }
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

function crearTarjeta(cupon, esPopular = false, indice = 0) {
  const articulo = document.createElement("article");

  articulo.className = esPopular ? "cupon popular" : "cupon";
  articulo.dataset.id = String(cupon.id);

  if (!esPopular) {
    articulo.dataset.color = COLORES[indice % COLORES.length];
  }

  articulo.innerHTML = `
    <div class="cupon-encabezado">
      ${esPopular ? '<span class="etiqueta-popular">MÁS USADO 🔥</span>' : ""}
      <h2 class="descuento">${escaparHtml(cupon.titulo)}</h2>
      <p class="subtitulo">de descuento</p>
    </div>

    <div class="cupon-contenido">
      <div class="datos-cupon">
        <p class="dato">
          Compra mínima: ${escaparHtml(cupon.compra_minima || "Consultar")}
        </p>

        <p class="dato">
          Ahorra hasta: ${escaparHtml(cupon.ahorro_maximo || "Consultar")}
        </p>
      </div>

      <div class="acciones-bloque">
        <div class="acciones-cupon">
          <button class="boton-canjear" type="button">
            📋 Copiar y Canjear
          </button>

          <button
            class="boton-compartir"
            type="button"
            aria-label="Compartir oferta"
            title="Compartir oferta"
          >
            ${iconoCompartir()}
          </button>
        </div>

        <p class="mensaje" aria-live="polite"></p>

        <p class="contador">
          🔥 <span class="numero-clics">${Number(cupon.clics || 0)}</span>
          usos registrados
        </p>
      </div>
    </div>
  `;

  articulo
    .querySelector(".boton-canjear")
    .addEventListener("click", () => copiarYCanjear(cupon, articulo));

  articulo
    .querySelector(".boton-compartir")
    .addEventListener("click", () => compartirCupon(cupon, articulo));

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
  popularContainer.replaceChildren();

  popularWrapper.hidden = true;
  todosWrapper.hidden = true;
  sinCupones.hidden = true;
}

function renderizarCategoria() {
  limpiarVista();

  const cuponesCategoria = todosLosCupones
    .filter((cupon) => normalizarCategoria(cupon) === categoriaActiva)
    .sort((a, b) => Number(b.clics || 0) - Number(a.clics || 0));

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

  const [cuponPopular, ...restoCupones] = cuponesCategoria;

  popularContainer.appendChild(crearTarjeta(cuponPopular, true));
  popularWrapper.hidden = false;

  if (restoCupones.length > 0) {
    const fragmento = document.createDocumentFragment();

    restoCupones.forEach((cupon, indice) => {
      fragmento.appendChild(crearTarjeta(cupon, false, indice));
    });

    cuponesContainer.appendChild(fragmento);
    todosWrapper.hidden = false;
  }

  estadoCarga.textContent = "";
}

function reiniciarContadorActualizacion() {
  segundosRestantes = SEGUNDOS_ACTUALIZACION;
  actualizarTextoContador();
}

function actualizarTextoContador() {
  contadorActualizacion.textContent =
    `Actualización automática en ${segundosRestantes} s`;
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
  if (redireccionEnProceso) return;

  redireccionEnProceso = true;

  const boton = tarjeta.querySelector(".boton-canjear");
  const mensaje = tarjeta.querySelector(".mensaje");
  const numeroClics = tarjeta.querySelector(".numero-clics");

  boton.disabled = true;
  boton.textContent = `✅ ${cupon.codigo}`;
  mensaje.textContent = "Cupón copiado correctamente.";

  modalRedireccion.querySelector("#modal-titulo").textContent = "¡Cupón copiado!";
  mostrarModal(cupon.codigo, true);

  try {
    await copiarTexto(cupon.codigo);

    registrarClic(cupon.id)
      .then((resultado) => {
        if (Number.isFinite(Number(resultado.clics))) {
          numeroClics.textContent = String(resultado.clics);
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

async function compartirCupon(cupon, tarjeta) {
  const mensaje = tarjeta.querySelector(".mensaje");

  const textoOferta =
    `${cupon.titulo}\n` +
    `Compra mínima: ${cupon.compra_minima || "Consultar"}\n` +
    `Ahorra hasta: ${cupon.ahorro_maximo || "Consultar"}\n` +
    `Obtén el cupón aquí:\n` +
    `${cupon.enlace}`;

  try {
    if (navigator.share) {
      await navigator.share({
        text: textoOferta,
      });

      mensaje.textContent = "Oferta compartida.";
    } else {
      await copiarTexto(textoOferta);
      mensaje.textContent = "Información copiada para compartir.";
    }

    setTimeout(() => {
      mensaje.textContent = "";
    }, 4000);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      mensaje.textContent = "No fue posible compartir la oferta.";
    }
  }
}

/* Publicidad */
async function cargarPublicidad() {
  try {
    const respuesta = await fetch("/api/publicidad", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!respuesta.ok) {
      throw new Error("No fue posible consultar la publicidad.");
    }

    const datos = await respuesta.json();
    publicidades = Array.isArray(datos) ? datos : [];

    if (publicidades.length === 0) {
      publicidadWrapper.hidden = true;
      detenerRotacionPublicidad();
      return;
    }

    publicidadActual = 0;
    publicidadWrapper.hidden = false;
    crearIndicadoresPublicidad();
    mostrarPublicidad();
    iniciarRotacionPublicidad();
  } catch (error) {
    console.warn(error);
    publicidadWrapper.hidden = true;
  }
}

function crearIndicadoresPublicidad() {
  publicidadIndicadores.replaceChildren();

  publicidades.forEach((_, indice) => {
    const punto = document.createElement("button");

    punto.type = "button";
    punto.className = "publicidad-punto";
    punto.setAttribute("aria-label", `Mostrar publicidad ${indice + 1}`);

    punto.addEventListener("click", () => {
      publicidadActual = indice;
      mostrarPublicidad();
      iniciarRotacionPublicidad();
    });

    publicidadIndicadores.appendChild(punto);
  });
}

function mostrarPublicidad() {
  const publicidad = publicidades[publicidadActual];

  if (!publicidad) return;

  publicidadContenido.style.animation = "none";
  void publicidadContenido.offsetWidth;
  publicidadContenido.style.animation = "";

  publicidadImagen.src = publicidad.imagen_url;
  publicidadImagen.alt = publicidad.titulo || "Publicidad";
  publicidadTitulo.textContent = publicidad.titulo || "Oferta destacada";
  publicidadDescripcion.textContent = publicidad.descripcion || "";
  publicidadEnlace.href = publicidad.enlace;

  const precioPublicado = String(publicidad.precio_publicado || "").trim();
  const precioCupon = String(publicidad.precio_cupon || "").trim();
  const tieneCupon = Boolean(String(publicidad.codigo_cupon || "").trim());

  precioPublicadoBloque.hidden = !precioPublicado;
  precioCuponBloque.hidden = !precioCupon;
  publicidadAvisoCupon.hidden = !tieneCupon;

  publicidadPrecioPublicado.textContent = precioPublicado;
  publicidadPrecioCupon.textContent = precioCupon;

  [...publicidadIndicadores.children].forEach((punto, indice) => {
    punto.classList.toggle("activo", indice === publicidadActual);
  });

  const mostrarControles = publicidades.length > 1;

  publicidadAnterior.hidden = !mostrarControles;
  publicidadSiguiente.hidden = !mostrarControles;
  publicidadIndicadores.hidden = !mostrarControles;
}

function cambiarPublicidad(direccion) {
  if (publicidades.length <= 1) return;

  publicidadActual =
    (publicidadActual + direccion + publicidades.length) % publicidades.length;

  mostrarPublicidad();
  iniciarRotacionPublicidad();
}

function iniciarRotacionPublicidad() {
  detenerRotacionPublicidad();

  if (publicidades.length <= 1) return;

  temporizadorPublicidad = window.setInterval(() => {
    cambiarPublicidad(1);
  }, MILISEGUNDOS_PUBLICIDAD);
}

function detenerRotacionPublicidad() {
  if (temporizadorPublicidad) {
    clearInterval(temporizadorPublicidad);
    temporizadorPublicidad = null;
  }
}

async function abrirPublicidad(publicidad) {
  if (redireccionEnProceso) return;

  redireccionEnProceso = true;
  detenerRotacionPublicidad();

  const codigo = String(publicidad.codigo_cupon || "").trim();
  const enlace = String(publicidad.enlace || "").trim();

  if (!enlace) {
    redireccionEnProceso = false;
    return;
  }

  try {
    /*
      El código permanece oculto en la página.
      Solo se copia al portapapeles cuando existe.
    */
    if (codigo) {
      await copiarTexto(codigo);
    }

    registrarClicPublicidad(publicidad.id);

    modalRedireccion.querySelector("#modal-titulo").textContent =
      codigo ? "¡Cupón copiado!" : "Abriendo Mercado Libre";

    mostrarModal("", false);

    let segundos = SEGUNDOS_REDIRECCION;

    const avanzar = () => {
      modalContador.textContent = String(segundos);
      cronometroNumero.textContent = String(segundos);

      if (segundos === 0) {
        cerrarModal();
        redireccionEnProceso = false;
        timeoutRedireccion = null;
        window.location.assign(enlace);
        return;
      }

      segundos -= 1;
      timeoutRedireccion = window.setTimeout(avanzar, 1000);
    };

    avanzar();
  } catch (error) {
    console.error("No fue posible abrir la publicidad.", error);
    cerrarModal();
    redireccionEnProceso = false;
    iniciarRotacionPublicidad();
  }
}

async function registrarClicPublicidad(id) {
  try {
    await fetch("/api/publicidad-clic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    iniciarRotacionPublicidad();
  } else {
    detenerRotacionPublicidad();
  }
});

cargarCupones();
cargarPublicidad();
