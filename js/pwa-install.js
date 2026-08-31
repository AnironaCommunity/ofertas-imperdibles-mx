// Paquete 83.0 - Invitación de instalación PWA
(() => {
  let deferredInstallPrompt = null;
  let banner = null;

  const instalacionRecordada = () => {
    try { return localStorage.getItem("oi_pwa_instalada") === "1"; } catch { return false; }
  };

  const estaInstalada = () =>
    instalacionRecordada() ||
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.matchMedia?.("(display-mode: fullscreen)")?.matches ||
    window.navigator.standalone === true;

  const esIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  function ocultarBanner() {
    if (!banner) return;
    banner.classList.remove("is-visible", "show-help");
    window.setTimeout(() => {
      if (banner && !banner.classList.contains("is-visible")) banner.hidden = true;
    }, 500);
  }

  function mostrarAyudaManual() {
    if (!banner) return;
    const ayuda = banner.querySelector(".pwa-install-help");
    if (!ayuda) return;

    ayuda.textContent = esIOS()
      ? "En iPhone/iPad: toca Compartir y después ‘Agregar a pantalla de inicio’."
      : "Abre el menú de tu navegador y elige ‘Instalar aplicación’ o ‘Agregar a pantalla de inicio’.";
    banner.classList.add("show-help");
  }

  async function solicitarInstalacion() {
    if (estaInstalada()) {
      ocultarBanner();
      return;
    }

    if (!deferredInstallPrompt) {
      mostrarAyudaManual();
      return;
    }

    const prompt = deferredInstallPrompt;
    deferredInstallPrompt = null;
    prompt.prompt();

    try {
      const resultado = await prompt.userChoice;
      if (resultado?.outcome === "accepted") ocultarBanner();
    } catch {
      // Si el navegador no devuelve userChoice, dejamos que appinstalled cierre el banner.
    }
  }

  function crearBanner() {
    if (estaInstalada() || document.querySelector("#pwa-install-banner")) return;

    banner = document.createElement("aside");
    banner.id = "pwa-install-banner";
    banner.className = "pwa-install-banner";
    banner.hidden = true;
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Instalar Ofertas Imperdibles MX como aplicación");

    banner.innerHTML = `
      <div class="pwa-install-card">
        <img class="pwa-install-logo" src="/img/pwa-icon-192.png" alt="Logo de Ofertas Imperdibles MX">
        <div class="pwa-install-copy">
          <strong class="pwa-install-title">Instala Ofertas Imperdibles MX</strong>
          <p class="pwa-install-text">Ten tus cupones y ofertas a un toque desde tu pantalla de inicio.</p>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn pwa-install-btn-primary" type="button" data-pwa-install>Instalar</button>
          <button class="pwa-install-close" type="button" data-pwa-close aria-label="Cerrar">×</button>
        </div>
        <p class="pwa-install-help" aria-live="polite"></p>
      </div>`;

    document.body.appendChild(banner);
    banner.querySelector("[data-pwa-install]")?.addEventListener("click", solicitarInstalacion);
    banner.querySelector("[data-pwa-close]")?.addEventListener("click", ocultarBanner);

    // Se muestra en cada apertura mientras la web no esté ejecutándose como app instalada.
    window.setTimeout(() => {
      if (estaInstalada() || !banner) return;
      banner.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => banner?.classList.add("is-visible")));
    }, 650);
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    try { localStorage.setItem("oi_pwa_instalada", "1"); } catch {}
    ocultarBanner();
  });

  document.addEventListener("DOMContentLoaded", crearBanner, { once: true });
})();
