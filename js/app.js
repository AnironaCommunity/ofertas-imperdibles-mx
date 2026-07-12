const cuponesContainer = document.querySelector("#cupones");
const popularContainer = document.querySelector("#cupon-popular");
const popularWrapper = document.querySelector("#popular-wrapper");
const todosWrapper = document.querySelector("#todos-wrapper");
const sinCupones = document.querySelector("#sin-cupones");
const estadoCarga = document.querySelector("#estado-carga");
const botonRecargar = document.querySelector("#boton-recargar");
const contadorActualizacion = document.querySelector("#contador-actualizacion");

const SEGUNDOS_ACTUALIZACION = 30;
const MILISEGUNDOS_NOMBRE_CUPON = 7000;

let segundosRestantes = SEGUNDOS_ACTUALIZACION;
let cargando = false;

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
          ↗
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

async function copiarYCanjear(cupon, tarjeta) {
  const boton = tarjeta.querySelector(".boton-canjear");
  const mensaje = tarjeta.querySelector(".mensaje");
  const numeroClics = tarjeta.querySelector(".numero-clics");
  const textoOriginal = "📋 Copiar y Canjear";

  /*
    Abrimos una pestaña inmediatamente para evitar que el navegador
    bloquee la redirección después de las operaciones asíncronas.
  */
  const nuevaPestana = window.open("", "_blank");

  boton.disabled = true;
  boton.textContent = `✅ ${cupon.codigo}`;
  mensaje.textContent = "Cupón copiado. Abriendo Mercado Libre...";

  try {
    await copiarTexto(cupon.codigo);

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

    if (nuevaPestana) {
      nuevaPestana.location.href = cupon.enlace;
    } else {
      setTimeout(() => {
        window.location.href = cupon.enlace;
      }, 400);
    }

    setTimeout(() => {
      boton.disabled = false;
      boton.textContent = textoOriginal;
      mensaje.textContent = "";
    }, MILISEGUNDOS_NOMBRE_CUPON);
  } catch (error) {
    console.error(error);

    if (nuevaPestana) {
      nuevaPestana.close();
    }

    boton.disabled = false;
    boton.textContent = textoOriginal;
    mensaje.textContent = "No fue posible copiar el cupón.";
  }
}

async function compartirCupon(cupon, tarjeta) {
  const mensaje = tarjeta.querySelector(".mensaje");

  const texto =
    `${cupon.titulo}\n` +
    `Compra mínima: ${cupon.compra_minima || "Consultar"}\n` +
    `Ahorra hasta: ${cupon.ahorro_maximo || "Consultar"}\n` +
    `Cupón: ${cupon.codigo}\n` +
    `${cupon.enlace}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: `${cupon.titulo} | Ofertas Imperdibles MX`,
        text: texto,
        url: cupon.enlace,
      });

      mensaje.textContent = "Cupón compartido.";
    } else {
      await copiarTexto(texto);
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

/* Cuenta regresiva y actualización automática cada 30 segundos. */
setInterval(() => {
  if (document.hidden || cargando) return;

  segundosRestantes -= 1;

  if (segundosRestantes <= 0) {
    cargarCupones();
    return;
  }

  actualizarTextoContador();
}, 1000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    cargarCupones();
  }
});

cargarCupones();
