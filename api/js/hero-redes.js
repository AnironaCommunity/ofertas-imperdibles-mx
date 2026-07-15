(async function cargarConfiguracionHero() {
  const hero = document.querySelector(".hero-redes");
  if (!hero) return;

  try {
    const response = await fetch("/api/cupones?action=hero-config", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) return;

    const config = await response.json();

    if (config.color_inicio) {
      hero.style.setProperty("--hero-color-inicio", config.color_inicio);
    }

    if (config.color_fin) {
      hero.style.setProperty("--hero-color-fin", config.color_fin);
    }

    if (config.imagen_url) {
      const image = hero.querySelector(".hero-redes-logo img");
      if (image) image.src = config.imagen_url;
    }
  } catch (error) {
    console.warn("No se pudo cargar la configuración de la barra.", error);
  }
})();
