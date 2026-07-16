(async function cargarBarraYVisitantes() {
  const hero = document.querySelector(".hero-redes");
  if (!hero) return;

  const image = hero.querySelector(".hero-redes-logo img");
  const defaultImage = image?.getAttribute("src") || "";
  const visitorBox = document.querySelector("#hero-contador-visitantes");
  const visitorTotal = document.querySelector("#hero-total-visitantes");

  const VISIT_STORAGE_KEY = "ofertas_imperdibles_ultima_visita";
  const VISIT_INTERVAL_MS = 24 * 60 * 60 * 1000;

  function formatVisitors(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
      return "0";
    }

    return new Intl.NumberFormat("es-MX").format(Math.floor(number));
  }

  async function loadHeroConfig() {
    const response = await fetch(
      `/api/cupones?action=hero-config&_=${Date.now()}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo cargar la configuración de la barra.");
    }

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
  }

  async function loadVisitors() {
    if (!visitorBox || !visitorTotal) return;

    let shouldRegister = true;

    try {
      const lastVisit = Number(localStorage.getItem(VISIT_STORAGE_KEY) || 0);
      shouldRegister =
        !Number.isFinite(lastVisit) ||
        Date.now() - lastVisit >= VISIT_INTERVAL_MS;
    } catch {
      shouldRegister = true;
    }

    const response = await fetch(
      `/api/cupones?action=visitantes&_=${Date.now()}`,
      {
        method: shouldRegister ? "POST" : "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo cargar el contador de visitantes.");
    }

    const data = await response.json();
    visitorTotal.textContent = formatVisitors(data.total_visitas);
    visitorBox.hidden = false;

    if (shouldRegister) {
      try {
        localStorage.setItem(VISIT_STORAGE_KEY, String(Date.now()));
      } catch {
        // La página puede seguir funcionando aunque localStorage esté bloqueado.
      }
    }
  }

  const results = await Promise.allSettled([
    loadHeroConfig(),
    loadVisitors(),
  ]);

  if (results[0].status === "rejected") {
    console.warn(
      "No se pudo cargar la configuración de la barra.",
      results[0].reason
    );
  }

  if (results[1].status === "rejected") {
    console.warn(
      "No se pudo cargar el contador de visitantes.",
      results[1].reason
    );
  }

  hero.classList.remove("hero-redes-pendiente");
  hero.classList.add("hero-redes-lista");
})();
