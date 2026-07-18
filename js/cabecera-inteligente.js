(() => {
  "use strict";

  const encabezado = document.querySelector(".encabezado");
  if (!encabezado) return;

  /* Limpia el estado de las versiones V70.0/V70.0.1. */
  document.body.classList.remove("cabecera-compacta");
  encabezado.removeAttribute("data-compacta");

  const referencias = {
    inicio: document.querySelector("#enlace-logo-inicio"),
    mercadoLibre: document.querySelector('[data-vista="ofertas_mercado_libre"]'),
    amazon: document.querySelector('[data-vista="ofertas_amazon"]'),
    comunidad: document.querySelector('[data-vista="comunidad_anirona"]')
  };

  if (!referencias.mercadoLibre || !referencias.amazon || !referencias.comunidad) return;

  const barra = document.createElement("div");
  barra.className = "smart-header";
  barra.setAttribute("role", "navigation");
  barra.setAttribute("aria-label", "Navegación rápida");
  barra.innerHTML = `
    <button type="button" class="smart-header-marca" aria-label="Volver al inicio">
      <img src="img/logo-ofertas-transparente.png?v=63.6" alt="" aria-hidden="true" />
      <span>Ofertas Imperdibles MX</span>
    </button>
    <div class="smart-header-nav">
      <button type="button" class="smart-header-boton" data-destino="mercadoLibre" data-etiqueta="Mercado Libre" aria-label="Ofertas Mercado Libre" aria-pressed="false">
        <img src="img/mercado-libre.png" alt="" aria-hidden="true" />
      </button>
      <button type="button" class="smart-header-boton" data-destino="amazon" data-etiqueta="Amazon" aria-label="Ofertas Amazon" aria-pressed="false">
        <img src="img/amazon.png" alt="" aria-hidden="true" />
      </button>
      <button type="button" class="smart-header-boton" data-destino="comunidad" data-etiqueta="Comunidad" aria-label="Comunidad Anirona" aria-pressed="false">
        <img src="img/anirona.png" alt="" aria-hidden="true" />
      </button>
    </div>
  `;
  document.body.appendChild(barra);

  const botonMarca = barra.querySelector(".smart-header-marca");
  const botones = Array.from(barra.querySelectorAll(".smart-header-boton"));

  botonMarca?.addEventListener("click", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.dataset.destino;
      referencias[destino]?.click();
      ocultar();
    });
  });

  function sincronizarSeleccion() {
    const mapa = {
      mercadoLibre: referencias.mercadoLibre,
      amazon: referencias.amazon,
      comunidad: referencias.comunidad
    };

    botones.forEach((boton) => {
      const original = mapa[boton.dataset.destino];
      const activo = original?.getAttribute("aria-pressed") === "true";
      boton.setAttribute("aria-pressed", String(activo));
    });
  }

  const observador = new MutationObserver(sincronizarSeleccion);
  [referencias.mercadoLibre, referencias.amazon, referencias.comunidad].forEach((elemento) => {
    observador.observe(elemento, { attributes: true, attributeFilter: ["aria-pressed", "class"] });
  });
  sincronizarSeleccion();

  let visible = false;
  let pendiente = false;
  let ultimoY = Math.max(0, window.scrollY || 0);
  let acumuladoDireccion = 0;
  let ultimaDireccion = 0;

  function mostrar() {
    if (visible) return;
    visible = true;
    barra.classList.add("smart-header-visible");
    barra.setAttribute("aria-hidden", "false");
  }

  function ocultar() {
    if (!visible) return;
    visible = false;
    barra.classList.remove("smart-header-visible");
    barra.setAttribute("aria-hidden", "true");
  }

  function actualizar() {
    const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    const delta = y - ultimoY;
    const direccion = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    const limiteCabecera = encabezado.offsetTop + encabezado.offsetHeight;

    if (direccion !== 0) {
      if (direccion !== ultimaDireccion) acumuladoDireccion = 0;
      acumuladoDireccion += Math.abs(delta);
      ultimaDireccion = direccion;
    }

    /*
      La barra solo entra cuando la cabecera original ya salió de la pantalla
      y el usuario continúa bajando. Al detectar una subida real se retira
      inmediatamente, por lo que nunca tapa el cupón mientras se regresa.
    */
    if (y <= Math.max(12, limiteCabecera - 20)) {
      ocultar();
    } else if (direccion < 0 && acumuladoDireccion >= 6) {
      ocultar();
    } else if (direccion > 0 && acumuladoDireccion >= 18) {
      mostrar();
    }

    ultimoY = y;
    pendiente = false;
  }

  function solicitarActualizacion() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(actualizar);
  }

  barra.setAttribute("aria-hidden", "true");
  window.addEventListener("scroll", solicitarActualizacion, { passive: true });
  window.addEventListener("resize", solicitarActualizacion, { passive: true });
  window.addEventListener("pageshow", () => {
    ultimoY = Math.max(0, window.scrollY || 0);
    acumuladoDireccion = 0;
    ocultar();
  });
})();
