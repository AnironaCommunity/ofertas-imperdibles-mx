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

const SEGUNDOS_ACTUALIZACION = 30;
const SEGUNDOS_REDIRECCION = 5;

let segundosRestantes = SEGUNDOS_ACTUALIZACION;
let cargando = false;
let temporizadorModal = null;

botonRecargar.addEventListener("click", () => {
  cargarCupones();
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

function crearTarjeta(cupon, esPopular = false) {
  const articulo = document.createElement("article");
  articulo.className = esPopular ? "cupon popular" : "cupon";
  articulo.dataset.id = String(cupon.id);

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

      <div class="acciones-cupon">
        <button class="boton-canjear" type="button">
          📋 Copiar y Canjear
        </button>

        <button
          class="boton-compartir"
          type="button"
          aria-label="Compartir cupón ${escaparHtml(cupon.codigo)}"
          title="Compartir cupón"
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
  `;

  const botonCanjear = articulo.querySelector(".boton-canjear");
  const botonCompartir = articulo.querySelector(".boton-compartir");

  botonCanjear.addEventListener("click", () => {
    copiarYCanjear(cupon, articulo);
  });

  botonCompartir.addEventListener("click", () => {
    compartirCupon(cupon, articulo);
  });

  return articulo;
}

function limpiarVista() {
  cuponesContainer.replaceChildren();
  popularContainer.replaceChildren();

  popularWrapper.hidden = true;
  todosWrapper.hidden = true;
  sinCupones.hidden = true;
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
  if (cargando) return;

  cargando = true;
  estadoCarga.className = "estado-carga";
  estadoCarga.textContent = "Cargando cupones...";
  botonRecargar.disabled = true;
  limpiarVista();

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

    if (!Array.isArray(cupones) || cupones.length === 0) {
      estadoCarga.textContent = "";
      sinCupones.hidden = false;
      return;
    }

    const cuponesOrdenados = [...cupones].sort(
      (a, b) => Number(b.clics || 0) - Number(a.clics || 0)
    );

    const [cuponPopular, ...restoCupones] = cuponesOrdenados;

    popularContainer.appendChild(crearTarjeta(cuponPopular, true));
    popularWrapper.hidden = false;

    if (restoCupones.length > 0) {
      const fragmento = document.createDocumentFragment();

      for (const cupon of restoCupones) {
        fragmento.appendChild(crearTarjeta(cupon));
      }

      cuponesContainer.appendChild(fragmento);
      todosWrapper.hidden = false;
    }

    estadoCarga.textContent = "";
  } catch (error) {
    console.error(error);
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

function mostrarModal(codigo) {
  modalCodigo.textContent = codigo;
  modalRedireccion.hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modalRedireccion.hidden = true;
  document.body.style.overflow = "";
}

function iniciarCuentaRegresiva(cupon, boton, mensaje) {
  let segundos = SEGUNDOS_REDIRECCION;

  modalContador.textContent = String(segundos);
  cronometroNumero.textContent = String(segundos);
  boton.textContent = `✅ ${cupon.codigo}`;

  temporizadorModal = setInterval(() => {
    segundos -= 1;

    modalContador.textContent = String(segundos);
    cronometroNumero.textContent = String(segundos);

    if (segundos <= 0) {
      clearInterval(temporizadorModal);
      temporizadorModal = null;

      cerrarModal();

      boton.disabled = false;
      boton.textContent = "📋 Copiar y Canjear";
      mensaje.textContent = "";

      /*
        Redirección en la misma pestaña para garantizar que el usuario
        vea primero la ventana emergente y la cuenta regresiva completa.
      */
      window.location.href = cupon.enlace;
    }
  }, 1000);
}

async function copiarYCanjear(cupon, tarjeta) {
  const boton = tarjeta.querySelector(".boton-canjear");
  const mensaje = tarjeta.querySelector(".mensaje");
  const numeroClics = tarjeta.querySelector(".numero-clics");

  boton.disabled = true;
  boton.textContent = `✅ ${cupon.codigo}`;
  mensaje.textContent = "Copiando cupón...";

  try {
    await copiarTexto(cupon.codigo);

    /*
      Primero se muestra la ventana con el código.
      La redirección ocurre únicamente al finalizar los 5 segundos.
    */
    mostrarModal(cupon.codigo);
    mensaje.textContent = "Cupón copiado correctamente.";

    try {
      const resultado = await Promise.race([
        registrarClic(cupon.id),
        new Promise((_, rechazar) => {
          setTimeout(() => rechazar(new Error("Tiempo agotado")), 1200);
        }),
      ]);

      if (Number.isFinite(Number(resultado.clics))) {
        numeroClics.textContent = String(resultado.clics);
      }
    } catch (error) {
      console.warn("El contador no pudo actualizarse:", error);
    }

    iniciarCuentaRegresiva(cupon, boton, mensaje);
  } catch (error) {
    console.error(error);

    cerrarModal();
    boton.disabled = false;
    boton.textContent = "📋 Copiar y Canjear";
    mensaje.textContent = "No fue posible copiar el cupón.";
  }
}

async function compartirCupon(cupon, tarjeta) {
  const mensaje = tarjeta.querySelector(".mensaje");

  /*
    Para navigator.share, el enlace se envía únicamente en "url".
    Por eso no se incluye también dentro de "text".
  */
  const textoCompartir =
    `${cupon.titulo}\n` +
    `Compra mínima: ${cupon.compra_minima || "Consultar"}\n` +
    `Ahorra hasta: ${cupon.ahorro_maximo || "Consultar"}\n` +
    `Cupón: ${cupon.codigo}`;

  /*
    En computadoras sin menú nativo, copiamos el texto y agregamos
    el enlace una sola vez.
  */
  const textoParaCopiar =
    `${textoCompartir}\n` +
    `${cupon.enlace}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: `${cupon.titulo} | Ofertas Imperdibles MX`,
        text: textoCompartir,
        url: cupon.enlace,
      });

      mensaje.textContent = "Cupón compartido.";
    } else {
      await copiarTexto(textoParaCopiar);
      mensaje.textContent =
        "Información del cupón copiada para compartir.";
    }

    setTimeout(() => {
      mensaje.textContent = "";
    }, 4000);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      mensaje.textContent = "No fue posible compartir el cupón.";
    }
  }
}

setInterval(() => {
  if (document.hidden || cargando || !modalRedireccion.hidden) return;

  segundosRestantes -= 1;

  if (segundosRestantes <= 0) {
    cargarCupones();
    return;
  }

  actualizarTextoContador();
}, 1000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && modalRedireccion.hidden) {
    cargarCupones();
  }
});

cargarCupones();
