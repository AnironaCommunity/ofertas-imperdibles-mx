const cuponesContainer = document.querySelector("#cupones");
const popularContainer = document.querySelector("#cupon-popular");
const popularWrapper = document.querySelector("#popular-wrapper");
const todosWrapper = document.querySelector("#todos-wrapper");
const sinCupones = document.querySelector("#sin-cupones");
const estadoCarga = document.querySelector("#estado-carga");
const botonRecargar = document.querySelector("#boton-recargar");

botonRecargar.addEventListener("click", cargarCupones);

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
      <p class="dato">
        Compra mínima: ${escaparHtml(cupon.compra_minima || "Consultar")}
      </p>

      <p class="dato">
        Ahorra hasta: ${escaparHtml(cupon.ahorro_maximo || "Consultar")}
      </p>

      <button class="boton-canjear" type="button">
        📋 Copiar y Canjear
      </button>

      <p class="mensaje" aria-live="polite"></p>

      <p class="contador">
        🔥 <span class="numero-clics">${Number(cupon.clics || 0)}</span>
        usos registrados
      </p>
    </div>
  `;

  const boton = articulo.querySelector(".boton-canjear");

  boton.addEventListener("click", () => {
    copiarYCanjear(cupon, articulo);
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

async function cargarCupones() {
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

    /* Ordena de mayor a menor según el contador de clics. */
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
    botonRecargar.disabled = false;
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
  const textoOriginal = boton.textContent;

  boton.disabled = true;
  mensaje.textContent = "";

  try {
    await copiarTexto(cupon.codigo);

    boton.textContent = "✅ Cupón copiado";
    mensaje.textContent = "Abriendo Mercado Libre...";

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

    setTimeout(() => {
      window.location.href = cupon.enlace;
    }, 350);
  } catch (error) {
    console.error(error);
    boton.disabled = false;
    boton.textContent = textoOriginal;
    mensaje.textContent = "No fue posible copiar el cupón.";
  }
}

cargarCupones();
