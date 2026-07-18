(async function iniciarBarra() {
  const hero = document.querySelector(".hero-redes");
  if (!hero) return;

  const image = hero.querySelector(".hero-redes-logo img");
  const defaultImage = image?.getAttribute("src") || "";
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

    if (image) {
      image.src = config.imagen_url || defaultImage;
    }

    const whatsappButton = hero.querySelector(".hero-redes-whatsapp");
    const facebookButton = hero.querySelector(".hero-redes-facebook");
    if (whatsappButton && config.enlace_whatsapp) {
      whatsappButton.href = config.enlace_whatsapp;
    }
    if (facebookButton && config.enlace_facebook) {
      facebookButton.href = config.enlace_facebook;
    }

    const labels = {
      textoDescriptivo: config.texto_descriptivo || "Cupones, promociones y novedades todos los días.",
      botonTienda: config.nombre_boton_tienda || "Tienda",
      seccionTienda: config.nombre_seccion_tienda || "Cupones de tienda",
      botonBancarios: config.nombre_boton_bancarios || "Bancarios",
      seccionBancarios: config.nombre_seccion_bancarios || "Cupones bancarios",
      botonComunidad: config.nombre_boton_comunidad || "Comunidad Anirona",
      seccionComunidad: config.nombre_seccion_comunidad || "Comunidad Anirona",
    };

    window.ofertasEtiquetas = labels;
    document.querySelector("#hero-texto-descriptivo")?.replaceChildren(labels.textoDescriptivo);
    document.querySelector("#nombre-boton-tienda")?.replaceChildren(labels.botonTienda);
    document.querySelector("#nombre-boton-bancarios")?.replaceChildren(labels.botonBancarios);
    document.querySelector("#nombre-boton-comunidad")?.replaceChildren(labels.botonComunidad);
    document.querySelector("#nombre-seccion-comunidad")?.replaceChildren(labels.seccionComunidad);
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