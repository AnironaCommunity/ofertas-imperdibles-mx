(async function iniciarBarra() {
  const hero = document.querySelector(".hero-redes");
  if (!hero) return;

  const image = hero.querySelector(".hero-redes-logo img");
  const defaultImage = image?.getAttribute("src") || "";
  const mainIcon = document.querySelector("#logo-principal-icono");
  const defaultMainIcon = mainIcon?.getAttribute("src") || "";
  const mainSiteName = document.querySelector("#nombre-sitio-principal");
  const mainSlogan = document.querySelector("#eslogan-sitio-principal");
  const barSiteName = document.querySelector("#nombre-sitio");
  const barDescription = document.querySelector("#hero-texto-descriptivo");
  const visitorBox = document.querySelector("#hero-contador-visitantes");
  const visitorTotal = document.querySelector("#hero-total-visitantes");

  const STORAGE_KEY = "ofertas_imperdibles_ultima_visita";
  const CONFIG_CACHE_KEY = "ofertas_imperdibles_config_cache";
  const ONE_DAY = 24 * 60 * 60 * 1000;

  function formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number)
      ? new Intl.NumberFormat("es-MX").format(number)
      : "0";
  }

  function renderMainSiteName(element, value) {
    if (!element) return;
    const words = String(value || "Ofertas Imperdibles").trim().split(/\s+/).filter(Boolean);
    const highlighted = words.pop() || "Imperdibles";
    element.replaceChildren();
    if (words.length) element.append(document.createTextNode(`${words.join(" ")} `));
    const span = document.createElement("span");
    span.className = "marca-principal-destacado";
    span.textContent = highlighted;
    element.append(span);
  }

  async function cargarConfiguracion() {
    const response = await fetch(
      `/api/cupones?action=hero-config&_=${Date.now()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return;

    const config = await response.json();

    try {
      const anterior = JSON.parse(localStorage.getItem(CONFIG_CACHE_KEY) || "{}");
      localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify({ ...anterior, ...config }));
    } catch {}

    if (config.color_inicio) {
      hero.style.setProperty("--hero-color-inicio", config.color_inicio);
      document.documentElement.style.setProperty("--tema-color-inicio", config.color_inicio);
    }

    if (config.color_fin) {
      hero.style.setProperty("--hero-color-fin", config.color_fin);
      document.documentElement.style.setProperty("--tema-color-fin", config.color_fin);
    }

    try {
      localStorage.setItem(
        "ofertas_imperdibles_tema",
        JSON.stringify({
          inicio: config.color_inicio || "#e9cdff",
          fin: config.color_fin || "#fae8fa",
        })
      );
    } catch {}

    if (mainIcon) {
      mainIcon.src = config.logo_icono_url || defaultMainIcon;
    }

    if (image) {
      image.src = config.imagen_url || defaultImage;
    }

    const configuredName = config.nombre_sitio || "Ofertas Imperdibles";
    if (mainSiteName) renderMainSiteName(mainSiteName, configuredName);
    if (barSiteName) barSiteName.textContent = config.nombre_barra || "Ofertas Imperdibles MX";

    if (mainSlogan) {
      mainSlogan.textContent = config.eslogan || "Las mejores ofertas, siempre";
      mainSlogan.hidden = config.mostrar_eslogan === false;
    }

    if (barDescription) {
      barDescription.textContent =
        config.texto_descriptivo ||
        "Cupones, promociones y novedades todos los días.";
      barDescription.hidden = false;
    }

    const whatsappButton = hero.querySelector(".hero-redes-whatsapp");
    const facebookButton = hero.querySelector(".hero-redes-facebook");
    if (whatsappButton && config.enlace_whatsapp) {
      whatsappButton.href = config.enlace_whatsapp;
    }
    if (facebookButton && config.enlace_facebook) {
      facebookButton.href = config.enlace_facebook;
    }

    const enlacesPrincipales = {
      mercadoLibre: config.enlace_mercado_libre || "https://www.mercadolibre.com.mx/",
      amazon: config.enlace_amazon || "https://www.amazon.com.mx/",
    };
    window.ofertasEnlacesPrincipales = enlacesPrincipales;
    const botonMercadoLibre = document.querySelector('[data-vista="ofertas_mercado_libre"]');
    const botonAmazon = document.querySelector('[data-vista="ofertas_amazon"]');
    if (botonMercadoLibre) botonMercadoLibre.dataset.enlaceExterno = enlacesPrincipales.mercadoLibre;
    if (botonAmazon) botonAmazon.dataset.enlaceExterno = enlacesPrincipales.amazon;
    document.dispatchEvent(new CustomEvent("ofertas:enlaces-principales-cargados", { detail: enlacesPrincipales }));

    const labels = {
      textoDescriptivo:
        config.texto_descriptivo ||
        "Cupones, promociones y novedades todos los días.",
      botonTienda: config.nombre_boton_tienda || "Tienda",
      seccionTienda: config.nombre_seccion_tienda || "Cupones de tienda",
      botonBancarios: config.nombre_boton_bancarios || "Bancarios",
      seccionBancarios: config.nombre_seccion_bancarios || "Cupones bancarios",
      botonComunidad: config.nombre_boton_comunidad || "Comunidad Anirona",
      descripcionComunidad: config.descripcion_boton_comunidad || "Rifas, novedades y publicaciones de la comunidad",
      seccionComunidad: config.nombre_seccion_comunidad || "Comunidad Anirona",
      botonMercadoLibre: config.nombre_boton_mercado_libre || "Ofertas Mercado Libre",
      botonAmazon: config.nombre_boton_amazon || "Ofertas Amazon",
    };

    window.ofertasEtiquetas = labels;
    const heroDescription = document.querySelector("#hero-texto-descriptivo");
    heroDescription?.replaceChildren(labels.textoDescriptivo);
    if (heroDescription) heroDescription.hidden = false;
    document.querySelector("#nombre-boton-tienda")?.replaceChildren(labels.botonTienda);
    document.querySelector("#nombre-boton-bancarios")?.replaceChildren(labels.botonBancarios);
    document.querySelector("#nombre-boton-comunidad")?.replaceChildren(labels.botonComunidad);
    document.querySelector("#descripcion-boton-comunidad")?.replaceChildren(labels.descripcionComunidad);
    document.querySelector("#nombre-seccion-comunidad")?.replaceChildren(labels.seccionComunidad);
    document.querySelector("#nombre-boton-mercado-libre")?.replaceChildren(labels.botonMercadoLibre);
    document.querySelector("#nombre-boton-amazon")?.replaceChildren(labels.botonAmazon);
    document.dispatchEvent(new CustomEvent("ofertas:etiquetas-cargadas", { detail: labels }));
  }

  async function cargarVisitantes() {
    if (!visitorBox || !visitorTotal) return;

    let registrar = true;

    try {
      const ultimaVisita = Number(localStorage.getItem(STORAGE_KEY) || 0);
      registrar = !ultimaVisita || Date.now() - ultimaVisita >= ONE_DAY;
    } catch {
      registrar = true;
    }

    const response = await fetch(
      `/api/cupones?action=visitantes&_=${Date.now()}`,
      {
        method: registrar ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      visitorTotal.textContent = "0";
      return;
    }

    const data = await response.json();
    const totalFormateado = formatNumber(data.total_visitas);
    visitorTotal.textContent = totalFormateado;
    visitorBox.hidden = false;

    try {
      const anterior = JSON.parse(localStorage.getItem(CONFIG_CACHE_KEY) || "{}");
      localStorage.setItem(
        CONFIG_CACHE_KEY,
        JSON.stringify({ ...anterior, total_visitantes: totalFormateado })
      );
    } catch {}

    if (registrar) {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {}
    }
  }

  await Promise.allSettled([
    cargarConfiguracion(),
    cargarVisitantes(),
  ]);

  hero.classList.remove("hero-redes-pendiente");
  hero.classList.add("hero-redes-lista");
})();