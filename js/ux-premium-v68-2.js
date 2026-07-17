(() => {
  "use strict";

  const CLAVE_COPIAS = "ofertas-imperdibles-cupones-copiados-total";
  const CLAVE_LOGROS = "ofertas-imperdibles-logros-v68";
  const logros = [
    { cantidad: 5, icono: "🏅", nombre: "Ahorrador" },
    { cantidad: 10, icono: "🥈", nombre: "Experto" },
    { cantidad: 25, icono: "🥇", nombre: "Maestro" },
    { cantidad: 100, icono: "🔥", nombre: "Leyenda" },
  ];

  const numero = (valor) => Number.parseInt(String(valor || "0").replace(/\D/g, ""), 10) || 0;

  function actualizarHora() {
    const destino = document.querySelector("#hora-ultima-actualizacion");
    if (!destino) return;
    destino.textContent = new Intl.DateTimeFormat("es-MX", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
  }

  function totalCuponesVisibles() {
    return document.querySelectorAll("#cupones .cupon[data-id]").length;
  }

  function actualizarMensajeHero() {
    const mensaje = document.querySelector("#hero-mensaje-dinamico");
    if (!mensaje) return;

    const total = totalCuponesVisibles();
    const ganador = document.querySelector("[data-ganador-publicado], .ganador-publicado, #ganador-publicado");
    let texto = "Cupones, promociones y novedades todos los días.";

    if (ganador?.textContent?.trim()) {
      texto = `🏆 Ya se publicó un ganador en Comunidad Anirona`;
    } else if (total > 0) {
      texto = `🎟️ ${total} ${total === 1 ? "cupón disponible" : "cupones disponibles"} en esta sección`;
    }

    if (mensaje.textContent === texto) return;
    mensaje.classList.add("ux-cambiando");
    window.setTimeout(() => {
      mensaje.textContent = texto;
      mensaje.classList.remove("ux-cambiando");
    }, 130);
  }

  function mostrarLogro(logro) {
    const toast = document.querySelector("#logro-toast");
    if (!toast) return;
    toast.querySelector("#logro-toast-icono").textContent = logro.icono;
    toast.querySelector("#logro-toast-titulo").textContent = `¡Logro desbloqueado: ${logro.nombre}!`;
    toast.querySelector("#logro-toast-texto").textContent = `Ya has aprovechado ${logro.cantidad} cupones desde este dispositivo.`;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("ux-visible"));
    window.clearTimeout(mostrarLogro.temporizador);
    mostrarLogro.temporizador = window.setTimeout(() => {
      toast.classList.remove("ux-visible");
      window.setTimeout(() => { toast.hidden = true; }, 230);
    }, 4300);
  }

  function registrarCopia() {
    const total = numero(localStorage.getItem(CLAVE_COPIAS)) + 1;
    localStorage.setItem(CLAVE_COPIAS, String(total));

    let obtenidos = [];
    try { obtenidos = JSON.parse(localStorage.getItem(CLAVE_LOGROS) || "[]"); } catch (_) {}
    const logro = logros.find((item) => item.cantidad === total && !obtenidos.includes(item.cantidad));
    if (!logro) return;
    obtenidos.push(logro.cantidad);
    localStorage.setItem(CLAVE_LOGROS, JSON.stringify(obtenidos));
    mostrarLogro(logro);
  }

  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".cupon .boton-copiar, .cupon .boton-canjear, .cupon button[class*='copiar']");
    if (boton && !boton.disabled) registrarCopia();

    if (evento.target.closest("#boton-recargar")) {
      actualizarHora();
      window.setTimeout(actualizarMensajeHero, 700);
    }
  }, true);

  const observador = new MutationObserver(() => actualizarMensajeHero());
  const cupones = document.querySelector("#cupones");
  if (cupones) observador.observe(cupones, { childList: true, subtree: true });

  actualizarHora();
  actualizarMensajeHero();
  window.setTimeout(actualizarMensajeHero, 900);
})();
