(() => {
  "use strict";

  const encabezado = document.querySelector(".encabezado");
  const hero = document.querySelector(".hero-redes");
  if (!encabezado || !hero) return;

  document.body.classList.remove("cabecera-compacta");
  encabezado.removeAttribute("data-compacta");
  document.querySelectorAll(".smart-header, .cabecera-hibrida").forEach((nodo) => nodo.remove());

  const originales = {
    whatsapp: document.querySelector(".hero-redes-whatsapp"),
    facebook: document.querySelector(".hero-redes-facebook"),
    visitantes: document.querySelector("#hero-total-visitantes"),
    mercadoLibre: document.querySelector('[data-vista="ofertas_mercado_libre"]'),
    amazon: document.querySelector('[data-vista="ofertas_amazon"]'),
    comunidad: document.querySelector('[data-vista="comunidad_anirona"]')
  };

  if (!originales.mercadoLibre || !originales.amazon || !originales.comunidad) return;

  const barra = document.createElement("div");
  barra.className = "cabecera-hibrida";
  barra.setAttribute("role", "navigation");
  barra.setAttribute("aria-label", "Redes y navegación rápida");
  barra.setAttribute("aria-hidden", "true");
  barra.innerHTML = `
    <div class="cabecera-hibrida-redes">
      <a class="cabecera-hibrida-red cabecera-hibrida-whatsapp" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">◉</span><span>WhatsApp</span>
      </a>
      <a class="cabecera-hibrida-red cabecera-hibrida-facebook" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">f</span><span>Facebook</span>
      </a>
      <span class="cabecera-hibrida-visitantes" title="Visitantes">
        <span aria-hidden="true">👥</span><strong>—</strong>
      </span>
    </div>
    <div class="cabecera-hibrida-nav">
      <button type="button" data-destino="mercadoLibre" aria-label="Ofertas Mercado Libre" aria-pressed="false">
        <img src="img/mercado-libre.png" alt="" aria-hidden="true"><span>Mercado Libre</span>
      </button>
      <button type="button" data-destino="amazon" aria-label="Ofertas Amazon" aria-pressed="false">
        <img src="img/amazon.png" alt="" aria-hidden="true"><span>Amazon</span>
      </button>
      <button type="button" data-destino="comunidad" aria-label="Comunidad Anirona" aria-pressed="false">
        <img src="img/anirona.png" alt="" aria-hidden="true"><span>Comunidad</span>
      </button>
    </div>
  `;
  document.body.appendChild(barra);

  const clonWhatsapp = barra.querySelector(".cabecera-hibrida-whatsapp");
  const clonFacebook = barra.querySelector(".cabecera-hibrida-facebook");
  const clonVisitantes = barra.querySelector(".cabecera-hibrida-visitantes strong");
  const botones = Array.from(barra.querySelectorAll(".cabecera-hibrida-nav button"));

  function sincronizarDatos() {
    if (clonWhatsapp && originales.whatsapp) clonWhatsapp.href = originales.whatsapp.href;
    if (clonFacebook && originales.facebook) clonFacebook.href = originales.facebook.href;
    if (clonVisitantes && originales.visitantes) clonVisitantes.textContent = originales.visitantes.textContent || "—";

    botones.forEach((boton) => {
      const original = originales[boton.dataset.destino];
      const activo = original?.getAttribute("aria-pressed") === "true" || original?.classList.contains("activo");
      boton.setAttribute("aria-pressed", String(Boolean(activo)));
    });
  }

  botones.forEach((boton) => {
    boton.addEventListener("click", () => originales[boton.dataset.destino]?.click());
  });

  const observadorCambios = new MutationObserver(sincronizarDatos);
  [originales.whatsapp, originales.facebook, originales.visitantes,
   originales.mercadoLibre, originales.amazon, originales.comunidad]
    .filter(Boolean)
    .forEach((elemento) => observadorCambios.observe(elemento, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["href", "aria-pressed", "class"]
    }));
  sincronizarDatos();

  let visible = false;
  function establecerVisible(nuevoEstado) {
    if (visible === nuevoEstado) return;
    visible = nuevoEstado;
    barra.classList.toggle("is-visible", visible);
    barra.setAttribute("aria-hidden", String(!visible));
  }

  /*
    La barra aparece únicamente cuando la barra social original ya salió casi
    por completo. No depende de la dirección del scroll, por lo que permanece
    estable al subir y no aparece de golpe encima de un cupón.
  */
  const centinela = document.createElement("span");
  centinela.setAttribute("aria-hidden", "true");
  centinela.style.cssText = "display:block;width:1px;height:1px;pointer-events:none;";
  hero.insertAdjacentElement("afterend", centinela);

  if ("IntersectionObserver" in window) {
    const observadorPosicion = new IntersectionObserver((entradas) => {
      const entrada = entradas[0];
      establecerVisible(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
    }, {
      root: null,
      threshold: 0,
      rootMargin: "0px 0px 0px 0px"
    });
    observadorPosicion.observe(centinela);
  } else {
    let pendiente = false;
    const actualizar = () => {
      pendiente = false;
      establecerVisible(centinela.getBoundingClientRect().top < 0);
    };
    window.addEventListener("scroll", () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    }, { passive: true });
    actualizar();
  }

  window.addEventListener("pageshow", () => {
    sincronizarDatos();
    establecerVisible(centinela.getBoundingClientRect().top < 0);
  });
})();
