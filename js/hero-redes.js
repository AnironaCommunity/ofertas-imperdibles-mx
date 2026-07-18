(async function iniciarBarra() {
  const hero = document.querySelector(".hero-redes");
  if (!hero) return;

  const image = hero.querySelector(".hero-redes-logo img");
  const defaultImage = image?.getAttribute("src") || "";
  const visitorBox = document.querySelector("#hero-contador-visitantes");
  const visitorTotal = document.querySelector("#hero-total-visitantes");

  const STORAGE_KEY = "ofertas_imperdibles_ultima_visita";
  const ONE_DAY = 24 * 60 * 60 * 1000;

  function formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number)
      ? new Intl.NumberFormat("es-MX").format(number)
      : "0";
  }


  function contrastePara(colorInicio, colorFin) {
    const hexToRgb = (hex) => {
      const clean = String(hex || "").replace("#", "");
      if (!/^[0-9a-f]{6}$/i.test(clean)) return [255, 255, 255];
      return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
    };
    const a = hexToRgb(colorInicio);
    const b = hexToRgb(colorFin);
    const rgb = a.map((v, i) => (v + b[i]) / 2);
    const luminancia = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    return luminancia > 0.62 ? "#173022" : "#ffffff";
  }

  function aplicarConfiguracionGlobal(config) {
    const inicio = config.color_inicio || "#e9cdff";
    const fin = config.color_fin || "#fae8fa";
    document.documentElement.style.setProperty("--tema-color-inicio", inicio);
    document.documentElement.style.setProperty("--tema-color-fin", fin);
    document.documentElement.style.setProperty("--tema-texto-activo", contrastePara(inicio, fin));

    const nombres = {
      tienda: config.nombre_tienda || "Tienda",
      bancarios: config.nombre_bancarios || "Bancarios",
      mercadolibre: config.nombre_mercadolibre || "Ofertas Mercado Libre",
      amazon: config.nombre_amazon || "Ofertas Amazon",
    };

    document.querySelector("#tab-tienda strong")?.replaceChildren(nombres.tienda);
    document.querySelector("#tab-bancarios strong")?.replaceChildren(nombres.bancarios);
    document.querySelector('[data-vista="ofertas_mercado_libre"] > span:not(.contador-seccion)')?.replaceChildren(nombres.mercadolibre);
    document.querySelector('[data-vista="ofertas_amazon"] > span:not(.contador-seccion)')?.replaceChildren(nombres.amazon);

    const tituloMl = document.querySelector("#seccion-ofertas-mercado-libre .titulo-seccion");
    const tituloAmazon = document.querySelector("#seccion-ofertas-amazon .titulo-seccion");
    if (tituloMl) {
      const img = tituloMl.querySelector("img")?.cloneNode(true);
      tituloMl.replaceChildren(...(img ? [img, document.createTextNode(` ${nombres.mercadolibre}`)] : [nombres.mercadolibre]));
    }
    if (tituloAmazon) {
      const img = tituloAmazon.querySelector("img")?.cloneNode(true);
      tituloAmazon.replaceChildren(...(img ? [img, document.createTextNode(` ${nombres.amazon}`)] : [nombres.amazon]));
    }

    window.OFERTAS_CONFIG = { ...(window.OFERTAS_CONFIG || {}), ...config, nombres };
    window.dispatchEvent(new CustomEvent("ofertas:configuracion", { detail: window.OFERTAS_CONFIG }));
  }

  async function cargarConfiguracion() {
    const response = await fetch(
      `/api/cupones?action=hero-config&_=${Date.now()}`,
      { cache: "no-store" }
    );

    if (!response.ok) return;

    const config = await response.json();

    if (config.color_inicio) {
      hero.style.setProperty("--hero-color-inicio", config.color_inicio);
    }

    if (config.color_fin) {
      hero.style.setProperty("--hero-color-fin", config.color_fin);
    }

    if (image) {
      image.src = config.imagen_url || defaultImage;
    }

    aplicarConfiguracionGlobal(config);
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
    visitorTotal.textContent = formatNumber(data.total_visitas);
    visitorBox.hidden = false;

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