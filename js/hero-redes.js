(async function cargarConfiguracionHero() {
  const hero = document.querySelector(".hero-redes");
  if (!hero) return;

  const image = hero.querySelector(".hero-redes-logo img");
  const defaultImage = image?.getAttribute("src") || "";

  try {
    const response = await fetch(`/api/cupones?action=hero-config&_=${Date.now()}`, {
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

    if (image) {
      image.src = config.imagen_url || defaultImage;
    }
  } catch (error) {
    console.warn("No se pudo cargar la configuración de la barra.", error);
  } finally {
    hero.classList.remove("hero-redes-pendiente");
    hero.classList.add("hero-redes-lista");
  }
})();
