const loginPanel = document.querySelector("#login-panel");
const adminPanel = document.querySelector("#admin-panel");
const passwordInput = document.querySelector("#admin-password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#cerrar-sesion");

const tabCoupons = document.querySelector("#tab-cupones");
const tabAds = document.querySelector("#tab-publicidad");
const tabAppearance = document.querySelector("#tab-apariencia");
const tabEvents = document.querySelector("#tab-eventos");
const couponsSection = document.querySelector("#seccion-cupones");
const adsSection = document.querySelector("#seccion-publicidad");
const appearanceSection = document.querySelector("#seccion-apariencia");
const eventsSection = document.querySelector("#seccion-eventos");

const heroConfigForm = document.querySelector("#hero-config-form");
const siteMainLogo = document.querySelector("#site-main-logo");
const siteMainLogoUrl = document.querySelector("#site-main-logo-url");
const siteMainLogoPreviewWrapper = document.querySelector("#site-main-logo-preview-wrapper");
const siteMainLogoPreview = document.querySelector("#site-main-logo-preview");
const siteMainLogoRemove = document.querySelector("#site-main-logo-remove");
const siteName = document.querySelector("#site-name");
const siteSlogan = document.querySelector("#site-slogan");
const siteShowSlogan = document.querySelector("#site-show-slogan");
const heroImage = document.querySelector("#hero-image");
const heroImageUrl = document.querySelector("#hero-image-url");
const heroPreviewWrapper = document.querySelector("#hero-preview-wrapper");
const heroPreview = document.querySelector("#hero-preview");
const heroRemoveImage = document.querySelector("#hero-remove-image");
const heroColorStart = document.querySelector("#hero-color-start");
const heroColorEnd = document.querySelector("#hero-color-end");
const heroAdminPreview = document.querySelector("#hero-admin-preview");
const heroAdminPreviewImage = document.querySelector("#hero-admin-preview-image");
const heroConfigMessage = document.querySelector("#hero-config-message");
const heroBarName = document.querySelector("#hero-bar-name");
const heroText = document.querySelector("#hero-text");
const heroStoreButtonName = document.querySelector("#hero-store-button-name");
const heroStoreSectionName = document.querySelector("#hero-store-section-name");
const heroBankButtonName = document.querySelector("#hero-bank-button-name");
const heroBankSectionName = document.querySelector("#hero-bank-section-name");
const heroCommunityButtonName = document.querySelector("#hero-community-button-name");
const heroCommunityButtonDescription = document.querySelector("#hero-community-button-description");
const heroCommunitySectionName = document.querySelector("#hero-community-section-name");
const heroMercadoLibreButtonName = document.querySelector("#hero-mercado-libre-button-name");
const heroMercadoLibreUrl = document.querySelector("#hero-mercado-libre-url");
const heroAmazonButtonName = document.querySelector("#hero-amazon-button-name");
const heroAmazonUrl = document.querySelector("#hero-amazon-url");
const heroWhatsappUrl = document.querySelector("#hero-whatsapp-url");
const heroFacebookUrl = document.querySelector("#hero-facebook-url");
const heroAdminPreviewText = document.querySelector("#hero-admin-preview-text");
const heroAdminPreviewName = document.querySelector("#hero-admin-preview-name");

/* Cupones */
const couponForm = document.querySelector("#coupon-form");
const couponId = document.querySelector("#coupon-id");
const couponTitle = document.querySelector("#coupon-title");
const couponCode = document.querySelector("#coupon-code");
const couponMinimum = document.querySelector("#coupon-minimum");
const couponSaving = document.querySelector("#coupon-saving");
const couponCategory = document.querySelector("#coupon-category");
const couponStart = document.querySelector("#coupon-start");
const couponEnd = document.querySelector("#coupon-end");
const couponLink = document.querySelector("#coupon-link");
const couponImage = document.querySelector("#coupon-image");
const couponImageUrl = document.querySelector("#coupon-image-url");
const couponImagePreviewWrapper = document.querySelector(
  "#coupon-image-preview-wrapper"
);
const couponImagePreview = document.querySelector(
  "#coupon-image-preview"
);
const couponImageRemove = document.querySelector(
  "#coupon-image-remove"
);
const couponActive = document.querySelector("#coupon-active");
const couponPublishNew = document.querySelector("#coupon-publish-new");
const couponFormTitle = document.querySelector("#coupon-form-title");
const couponFormMessage = document.querySelector("#coupon-form-message");
const cancelCoupon = document.querySelector("#cancelar-cupon");
const newCoupon = document.querySelector("#nuevo-cupon");
const refreshCoupons = document.querySelector("#actualizar-cupones");
const couponList = document.querySelector("#coupon-list");
const couponListMessage = document.querySelector("#coupon-list-message");

/* Resumen para compartir */
const shareSummaryLink = document.querySelector("#resumen-liga");
const shareSummaryLimit = document.querySelector("#resumen-limite");
const generateShareSummary = document.querySelector("#generar-resumen");
const copyShareSummaryText = document.querySelector("#copiar-resumen-texto");
const downloadShareSummaryImage = document.querySelector("#descargar-resumen-imagen");
const shareShareSummaryImage = document.querySelector("#compartir-resumen-imagen");
const shareSummaryMessage = document.querySelector("#resumen-compartir-mensaje");
const shareSummaryResult = document.querySelector("#resumen-compartir-resultado");
const shareSummaryText = document.querySelector("#resumen-texto");
const shareSummaryPreview = document.querySelector("#resumen-imagen-preview");
const shareSummaryCanvas = document.querySelector("#resumen-canvas");
let shareSummaryBlob = null;

/* Importador */
const importerPanel = document.querySelector("#importador-panel");
const showImporter = document.querySelector("#mostrar-importador");
const closeImporter = document.querySelector("#cerrar-importador");
const importText = document.querySelector("#texto-importacion");
const processImport = document.querySelector("#procesar-importacion");
const clearImport = document.querySelector("#limpiar-importacion");
const saveImport = document.querySelector("#guardar-importacion");
const importMessage = document.querySelector("#import-message");
const importPreview = document.querySelector("#import-preview");
const importPublishNew = document.querySelector("#import-publish-new");
const importList = document.querySelector("#import-list");
const importGeneralLink = document.querySelector("#import-general-link");
const importUseGeneralLink = document.querySelector("#import-use-general-link");
const importSummary = document.querySelector("#import-summary");
const importCategory = document.querySelector("#import-category");
const importExpirationTime = document.querySelector("#import-expiration-time");

/* Publicidad */
const adForm = document.querySelector("#ad-form");
const adId = document.querySelector("#ad-id");
const adImageUrl = document.querySelector("#ad-image-url");
const adTitle = document.querySelector("#ad-title");
const adDescription = document.querySelector("#ad-description");
const adSections = [...document.querySelectorAll(".ad-section")];
const adPlatforms = [
  ...document.querySelectorAll('input[name="ad-platform"]'),
];
const adLink = document.querySelector("#ad-link");
const adPricePublished = document.querySelector("#ad-price-published");
const adPriceCoupon = document.querySelector("#ad-price-coupon");
const adCouponCode = document.querySelector("#ad-coupon-code");
const adCouponRecommendation = document.querySelector(
  "#ad-coupon-recommendation"
);
const bulkPricesList = document.querySelector("#precios-masivos-lista");
const bulkPricesMessage = document.querySelector("#precios-masivos-mensaje");
const recalculateBulkPrices = document.querySelector(
  "#recalcular-precios-masivos"
);
const saveBulkPrices = document.querySelector("#guardar-precios-masivos");

const adOrder = document.querySelector("#ad-order");
const adActive = document.querySelector("#ad-active");
const adImage = document.querySelector("#ad-image");
const adPreviewWrapper = document.querySelector("#ad-preview-wrapper");
const adPreview = document.querySelector("#ad-preview");
const adFormTitle = document.querySelector("#ad-form-title");
const adFormMessage = document.querySelector("#ad-form-message");
const cancelAd = document.querySelector("#cancelar-publicidad");
const newAd = document.querySelector("#nueva-publicidad");
const refreshAds = document.querySelector("#actualizar-publicidad");
const adList = document.querySelector("#ad-list");
const adListMessage = document.querySelector("#ad-list-message");

let adminPassword = sessionStorage.getItem("adminPassword") || "";
let coupons = [];
let ads = [];
let detectedCoupons = [];

function setMessage(element, text = "", isError = false) {
  element.textContent = text;
  element.classList.toggle("error", isError);
}

function readableError(error, fallback = "No fue posible completar la operación.") {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  if (error instanceof Error && typeof error.message === "string") {
    return error.message;
  }

  if (typeof error.message === "string") return error.message;
  if (typeof error.error === "string") return error.error;
  if (typeof error.details === "string") return error.details;
  if (typeof error.hint === "string") return error.hint;

  if (error.error && typeof error.error === "object") {
    return readableError(error.error, fallback);
  }

  if (error.message && typeof error.message === "object") {
    return readableError(error.message, fallback);
  }

  try {
    const serialized = JSON.stringify(error);
    return serialized && serialized !== "{}" ? serialized : fallback;
  } catch {
    return fallback;
  }
}

async function api(url, options = {}) {
  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");
  headers.set("x-admin-password", adminPassword);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      readableError(
        data,
        `Error ${response.status}: no fue posible completar la operación.`
      )
    );
  }

  return data;
}

async function login() {
  const password = passwordInput.value.trim() || adminPassword;

  if (!password) {
    setMessage(loginMessage, "Ingresa la contraseña.", true);
    return;
  }

  loginButton.disabled = true;

  try {
    adminPassword = password;
    await api("/api/admin-cupones");

    sessionStorage.setItem("adminPassword", password);
    loginPanel.hidden = true;
    adminPanel.hidden = false;

    await Promise.all([loadCoupons(), loadAds()]);
  } catch (error) {
    adminPassword = "";
    sessionStorage.removeItem("adminPassword");
    setMessage(loginMessage, error.message, true);
  } finally {
    loginButton.disabled = false;
  }
}

function logout() {
  adminPassword = "";
  sessionStorage.removeItem("adminPassword");

  adminPanel.hidden = true;
  loginPanel.hidden = false;
  passwordInput.value = "";
}

function showSection(section) {
  const isCoupons = section === "cupones";
  const isAds = section === "publicidad";
  const isEvents = section === "eventos";
  const isAppearance = section === "apariencia";

  tabCoupons.classList.toggle("activo", isCoupons);
  tabAds.classList.toggle("activo", isAds);
  tabEvents?.classList.toggle("activo", isEvents);
  tabAppearance.classList.toggle("activo", isAppearance);

  couponsSection.hidden = !isCoupons;
  adsSection.hidden = !isAds;
  if (eventsSection) eventsSection.hidden = !isEvents;
  appearanceSection.hidden = !isAppearance;

  if (isAppearance) loadHeroConfig();
}

/* ================= CUPONES ================= */
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const MEXICO_TIME_ZONE = "America/Mexico_City";

function partsInMexico(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MEXICO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
}

function mexicoLocalToIso(value) {
  if (!value) return null;

  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const desiredAsUtc = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    0
  );

  let guess = desiredAsUtc;

  /*
    Ajuste iterativo para interpretar datetime-local como hora de México,
    independientemente de la zona horaria del teléfono o computadora.
  */
  for (let index = 0; index < 3; index += 1) {
    const parts = partsInMexico(new Date(guess));

    const representedAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    );

    guess += desiredAsUtc - representedAsUtc;
  }

  return new Date(guess).toISOString();
}

function isoToMexicoLocal(value) {
  if (!value) return "";

  const parts = partsInMexico(new Date(value));

  return (
    `${parts.year}-${parts.month}-${parts.day}` +
    `T${parts.hour}:${parts.minute}`
  );
}

function formatMexicoDate(value) {
  if (!value) return "Sin definir";

  return new Intl.DateTimeFormat("es-MX", {
    timeZone: MEXICO_TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function couponAutomaticStatus(coupon) {
  if (!coupon.activo) {
    return {
      key: "inactivo",
      label: "⚪ Inactivo",
    };
  }

  const now = Date.now();
  const start = coupon.fecha_inicio
    ? new Date(coupon.fecha_inicio).getTime()
    : null;
  const end = coupon.fecha_fin
    ? new Date(coupon.fecha_fin).getTime()
    : null;

  if (start !== null && start > now) {
    return {
      key: "programado",
      label: "🟡 Programado",
    };
  }

  if (end !== null && end <= now) {
    return {
      key: "finalizado",
      label: "🔴 Finalizado",
    };
  }

  return {
    key: "activo",
    label: "🟢 Activo",
  };
}

function resetCouponForm() {
  couponForm.reset();
  couponId.value = "";
  couponCategory.value = "tienda";
  couponStart.value = "";
  couponEnd.value = "";
  couponActive.checked = true;
  couponPublishNew.checked = true;
  couponFormTitle.textContent = "Agregar cupón";
  cancelCoupon.hidden = true;
  setMessage(couponFormMessage);
}

function editCoupon(coupon) {
  couponId.value = coupon.id;
  couponTitle.value = coupon.titulo || "";
  couponCode.value = coupon.codigo || "";
  couponMinimum.value = coupon.compra_minima || "";
  couponSaving.value = coupon.ahorro_maximo || "";
  couponCategory.value =
    coupon.categoria === "bancarios" ? "bancarios" : "tienda";
  couponStart.value = isoToMexicoLocal(coupon.fecha_inicio);
  couponEnd.value = isoToMexicoLocal(coupon.fecha_fin);
  couponLink.value = coupon.enlace || "";
  couponImage.value = "";
  couponImageUrl.value = coupon.imagen_url || "";
  couponImagePreview.src = coupon.imagen_url || "";
  couponImagePreviewWrapper.hidden = !coupon.imagen_url;
  couponActive.checked = Boolean(coupon.activo);
  couponPublishNew.checked = false;

  couponFormTitle.textContent = `Editar cupón: ${coupon.titulo}`;
  cancelCoupon.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCoupons() {
  couponList.replaceChildren();

  if (!coupons.length) {
    couponList.innerHTML =
      '<tr><td colspan="6">No hay cupones registrados.</td></tr>';
    return;
  }

  for (const coupon of coupons) {
    const row = document.createElement("tr");

    const automaticStatus = couponAutomaticStatus(coupon);

    row.innerHTML = `
      <td>${escapeHtml(coupon.titulo)}</td>
      <td>${escapeHtml(coupon.codigo)}</td>
      <td>${coupon.categoria === "bancarios" ? "💳 Bancarios" : "🛒 Tienda"}</td>
      <td>${Number(coupon.clics || 0)}</td>
      <td>
        <div class="programacion-detalle">
          <div><strong>Inicio:</strong> ${escapeHtml(formatMexicoDate(coupon.fecha_inicio))}</div>
          <div><strong>Fin:</strong> ${escapeHtml(formatMexicoDate(coupon.fecha_fin))}</div>
        </div>
      </td>
      <td>
        <span class="estado-automatico ${automaticStatus.key}">
          ${automaticStatus.label}
        </span>
      </td>
      <td>
        <div class="acciones-tabla">
          <button class="editar" data-action="edit" data-id="${coupon.id}">
            Editar
          </button>

          <button class="estado" data-action="toggle" data-id="${coupon.id}">
            ${coupon.activo ? "Desactivar" : "Activar"}
          </button>

          <button class="eliminar" data-action="delete" data-id="${coupon.id}">
            Eliminar
          </button>
        </div>
      </td>
    `;

    couponList.appendChild(row);
  }
}

async function loadCoupons() {
  refreshCoupons.disabled = true;
  setMessage(couponListMessage, "Cargando cupones...");

  try {
    coupons = await api("/api/admin-cupones");
    renderCoupons();
    setMessage(couponListMessage, `${coupons.length} cupones registrados.`);
  } catch (error) {
    setMessage(couponListMessage, error.message, true);
  } finally {
    refreshCoupons.disabled = false;
  }
}


function activeCouponsForSharing() {
  return coupons.filter((coupon) => couponAutomaticStatus(coupon).key === "activo");
}

function shareSummaryDate() {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: MEXICO_TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function couponSummaryLines(coupon) {
  const lines = [];
  lines.push(String(coupon.titulo || "Cupón disponible").trim());
  if (coupon.compra_minima) lines.push(`Compra mínima: ${coupon.compra_minima}`);
  if (coupon.ahorro_maximo) lines.push(`Ahorra hasta: ${coupon.ahorro_maximo}`);
  return lines;
}

function buildShareSummaryText(selectedCoupons, link, totalActive) {
  const date = shareSummaryDate();
  const lines = [
    `🔥 CUPONES DISPONIBLES HOY EN MERCADO LIBRE · ${date}`,
    "",
  ];

  selectedCoupons.forEach((coupon, index) => {
    const details = couponSummaryLines(coupon);
    lines.push(`✅ ${details[0]}`);
    details.slice(1).forEach((detail) => lines.push(detail));
    if (index < selectedCoupons.length - 1) lines.push("");
  });

  if (selectedCoupons.length < totalActive) {
    lines.push("", `Y ${totalActive - selectedCoupons.length} cupones activos más disponibles en la página.`);
  }

  lines.push(
    "",
    "Consulta los cupones y canjéalos aquí 👇",
    link,
    "",
    "Ingresa desde nuestra página para copiar y canjear el cupón en Mercado Libre."
  );

  return lines.join("\n");
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function loadShareImage(src) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  try {
    await image.decode();
    return image;
  } catch {
    return null;
  }
}

function drawImageContain(context, image, x, y, width, height) {
  if (!image?.naturalWidth || !image?.naturalHeight) return;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

async function drawShareSummaryImage(selectedCoupons, link, totalActive) {
  const canvas = shareSummaryCanvas;
  const context = canvas.getContext("2d");
  const width = 1080;
  const topImageHeight = 255;
  const headerHeight = 280;
  const cardGap = 22;
  const cardHeight = 154;
  const footerHeight = 290;
  const side = 70;
  const height = topImageHeight + headerHeight + selectedCoupons.length * (cardHeight + cardGap) + footerHeight;

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#f4f8f5";
  context.fillRect(0, 0, width, height);

  const [mercadoLibreImage, offersLogo] = await Promise.all([
    loadShareImage("../img/mercado-libre-resumen.png"),
    loadShareImage("../img/logo-ofertas-horizontal.png"),
  ]);

  context.fillStyle = "#ffe600";
  context.fillRect(0, 0, width, topImageHeight);
  if (mercadoLibreImage) {
    drawImageContain(context, mercadoLibreImage, 0, 0, width, topImageHeight);
  }

  const headerY = topImageHeight;
  const gradient = context.createLinearGradient(0, headerY, width, headerY);
  gradient.addColorStop(0, "#15a56d");
  gradient.addColorStop(1, "#9edc78");
  context.fillStyle = gradient;
  context.fillRect(0, headerY, width, headerHeight);

  if (offersLogo) {
    const logoWidth = 330;
    const ratio = offersLogo.naturalHeight / offersLogo.naturalWidth;
    context.drawImage(offersLogo, side, headerY + 38, logoWidth, logoWidth * ratio);
  }

  context.fillStyle = "#ffffff";
  context.font = "700 54px Arial, sans-serif";
  context.fillText("CUPONES DISPONIBLES HOY", side, headerY + 170);
  context.font = "700 32px Arial, sans-serif";
  context.fillText("EN MERCADO LIBRE", side, headerY + 214);
  context.font = "400 27px Arial, sans-serif";
  context.fillText(shareSummaryDate(), side, headerY + 252);

  let y = topImageHeight + headerHeight + cardGap;
  selectedCoupons.forEach((coupon, index) => {
    roundedRect(context, side, y, width - side * 2, cardHeight, 24);
    context.fillStyle = "#ffffff";
    context.fill();
    context.strokeStyle = "#dce9e1";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = coupon.categoria === "bancarios" ? "#243b63" : "#16a36c";
    roundedRect(context, side + 24, y + 24, 58, 58, 16);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = "700 25px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText(String(index + 1), side + 53, y + 62);
    context.textAlign = "left";

    const textX = side + 105;
    const maxTextWidth = width - side - textX - 30;
    context.fillStyle = "#14221b";
    context.font = "700 34px Arial, sans-serif";
    const titleLines = wrapCanvasText(context, coupon.titulo || "Cupón disponible", maxTextWidth).slice(0, 2);
    titleLines.forEach((line, lineIndex) => context.fillText(line, textX, y + 55 + lineIndex * 38));

    const detailY = y + (titleLines.length > 1 ? 125 : 100);
    context.fillStyle = "#4c5d54";
    context.font = "400 25px Arial, sans-serif";
    const details = [];
    if (coupon.compra_minima) details.push(`Compra mínima: ${coupon.compra_minima}`);
    if (coupon.ahorro_maximo) details.push(`Ahorra hasta: ${coupon.ahorro_maximo}`);
    context.fillText(details.join("   •   ") || "Consulta las condiciones en la página", textX, detailY);

    y += cardHeight + cardGap;
  });

  const footerY = height - footerHeight;
  context.fillStyle = "#ffffff";
  context.fillRect(0, footerY, width, footerHeight);
  context.fillStyle = "#17221d";
  context.font = "700 34px Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("Consulta y canjea los cupones aquí", width / 2, footerY + 72);

  context.fillStyle = "#16a36c";
  context.font = "700 31px Arial, sans-serif";
  const linkLines = wrapCanvasText(context, link, width - 150).slice(0, 2);
  linkLines.forEach((line, index) => context.fillText(line, width / 2, footerY + 125 + index * 38));

  context.fillStyle = "#56655d";
  context.font = "400 23px Arial, sans-serif";
  context.fillText("Ingresa desde nuestra página para copiar y canjear en Mercado Libre.", width / 2, footerY + 225);
  context.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No fue posible crear la imagen.")), "image/png", 1);
  });
}

function validShareLink(value) {
  const text = String(value || "").trim();
  try {
    const url = new URL(text);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    return url.toString();
  } catch {
    throw new Error("Ingresa una liga válida para consultar los cupones.");
  }
}

async function createShareSummary() {
  generateShareSummary.disabled = true;
  setMessage(shareSummaryMessage, "Generando resumen...");
  try {
    if (!coupons.length) await loadCoupons();
    const active = activeCouponsForSharing();
    if (!active.length) throw new Error("No hay cupones activos y vigentes para incluir.");

    const link = validShareLink(shareSummaryLink.value);
    const limitValue = shareSummaryLimit.value;
    const limit = limitValue === "all" ? active.length : Number(limitValue);
    const selected = active.slice(0, limit);
    shareSummaryText.value = buildShareSummaryText(selected, link, active.length);
    shareSummaryBlob = await drawShareSummaryImage(selected, link, active.length);
    if (shareSummaryPreview.src) URL.revokeObjectURL(shareSummaryPreview.src);
    shareSummaryPreview.src = URL.createObjectURL(shareSummaryBlob);
    shareSummaryResult.hidden = false;
    copyShareSummaryText.disabled = false;
    downloadShareSummaryImage.disabled = false;
    shareShareSummaryImage.disabled = false;
    setMessage(shareSummaryMessage, `✅ Resumen generado con ${selected.length} de ${active.length} cupones activos. Los códigos no se incluyen.`);
  } catch (error) {
    setMessage(shareSummaryMessage, readableError(error), true);
  } finally {
    generateShareSummary.disabled = false;
  }
}

async function copyGeneratedShareText() {
  if (!shareSummaryText.value) return;
  try {
    await navigator.clipboard.writeText(shareSummaryText.value);
  } catch {
    shareSummaryText.focus();
    shareSummaryText.select();
    document.execCommand("copy");
  }
  setMessage(shareSummaryMessage, "✅ Texto copiado. No contiene códigos de cupón.");
}

function downloadGeneratedShareImage() {
  if (!shareSummaryBlob) return;
  const url = URL.createObjectURL(shareSummaryBlob);
  const anchor = document.createElement("a");
  const day = new Intl.DateTimeFormat("es-MX", { timeZone: MEXICO_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).replaceAll("/", "-");
  anchor.href = url;
  anchor.download = `cupones-disponibles-${day}.png`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareGeneratedImage() {
  if (!shareSummaryBlob) return;
  const file = new File([shareSummaryBlob], "cupones-disponibles.png", { type: "image/png" });
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({
        title: "Cupones disponibles hoy",
        text: "Consulta los cupones activos desde nuestra página.",
        files: [file],
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  downloadGeneratedShareImage();
  setMessage(shareSummaryMessage, "Tu navegador no permite compartir la imagen directamente; se descargó para que puedas enviarla.");
}

async function uploadCouponImage() {
  const file = couponImage.files[0];

  if (!file) {
    return couponImageUrl.value;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen válida para el cupón.");
  }

  const dataUrl = await optimizeImage(file);

  const result = await api("/api/admin-publicidad-imagen", {
    method: "POST",
    body: JSON.stringify({
      data_url: dataUrl,
      nombre: `cupon-${file.name}`,
    }),
  });

  return result.imagen_url;
}

async function saveCoupon(event) {
  event.preventDefault();

  const submit = couponForm.querySelector('button[type="submit"]');
  const id = Number(couponId.value);

  submit.disabled = true;
  setMessage(couponFormMessage, "Guardando cupón...");

  try {
    const imageUrl = await uploadCouponImage();

    const payload = {
      titulo: couponTitle.value.trim(),
      codigo: couponCode.value.trim(),
      compra_minima: couponMinimum.value.trim(),
      ahorro_maximo: couponSaving.value.trim(),
      categoria: couponCategory.value,
      fecha_inicio: mexicoLocalToIso(couponStart.value),
      fecha_fin: mexicoLocalToIso(couponEnd.value),
      enlace: couponLink.value.trim(),
      imagen_url: imageUrl || "",
      activo: couponActive.checked,
      publicar_como_nuevo: couponPublishNew.checked,
    };

    await api("/api/admin-cupones", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(id ? { id, ...payload } : payload),
    });

    resetCouponForm();
    await loadCoupons();
  } catch (error) {
    setMessage(couponFormMessage, error.message, true);
  } finally {
    submit.disabled = false;
  }
}

async function handleCouponList(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const coupon = coupons.find((item) => Number(item.id) === id);

  if (!coupon) return;

  if (button.dataset.action === "edit") {
    editCoupon(coupon);
    return;
  }

  if (button.dataset.action === "toggle") {
    await api("/api/admin-cupones", {
      method: "PUT",
      body: JSON.stringify({
        id,
        activo: !coupon.activo,
      }),
    });

    await loadCoupons();
    return;
  }

  if (button.dataset.action === "delete") {
    if (!confirm(`¿Eliminar el cupón "${coupon.titulo}"?`)) return;

    await api(`/api/admin-cupones?id=${id}`, {
      method: "DELETE",
    });

    await loadCoupons();
  }
}

/* Importador */
function normalizeLine(line) {
  return line
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImportedMoney(value) {
  const raw = String(value || "")
    .replace(/[^\d.,-]/g, "")
    .trim();

  if (!raw) return "";

  let normalized = raw;
  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    normalized = raw.split(thousandsSeparator).join("").replace(decimalSeparator, ".");
  } else if (/^\d{1,3}([.,]\d{3})+$/.test(raw)) {
    normalized = raw.replace(/[.,]/g, "");
  } else if (lastComma >= 0) {
    normalized = raw.replace(/,/g, ".");
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return "";

  return `$${amount.toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function extractMoney(line) {
  const match = String(line || "").match(/\$?\s*[\d,.]+/);
  return match ? normalizeImportedMoney(match[0]) : "";
}

function normalizeDiscountTitle(line) {
  const value = normalizeLine(line);
  const percentMatch = value.match(/([\d.,]+)\s*%\s*(?:de\s*descuento|off)?/i);

  if (percentMatch) {
    const percent = Number(percentMatch[1].replace(",", "."));
    return Number.isFinite(percent) ? `${percent.toLocaleString("es-MX")}% OFF` : "";
  }

  const amountMatch = value.match(/\$\s*[\d,.]+\s*(?:de\s*descuento|off)?/i);
  if (amountMatch) {
    const amount = extractMoney(amountMatch[0]);
    return amount ? `${amount} OFF` : "";
  }

  return /\boff\b/i.test(value) ? value : "";
}

function isValidImportLink(value) {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function detectImportFormat(lines) {
  if (lines.some((line) => /^\s*🎟️?\s*cup[oó]n\s*:/i.test(line))) {
    return "Mercado Libre";
  }

  return "Clásico";
}

function parseImportBlock(block, options = {}) {
  const lines = block
    .split("\n")
    .map(normalizeLine)
    .filter(Boolean);

  const format = detectImportFormat(lines);
  const couponLine = lines.find((line) => /^\s*🎟️?\s*cup[oó]n\s*:/i.test(line));
  const blockLink = lines.find((line) => /^https?:\/\/\S+/i.test(line)) || "";
  const generalLink = String(options.generalLink || "").trim();
  const link = options.useGeneralLink ? generalLink : blockLink;

  const minimumLine = lines.find((line) =>
    /compra\s*m[ií]nima|m[ií]nimo/i.test(line)
  );

  const savingLine = lines.find((line) =>
    /ahorra\s*hasta|descuento\s*m[aá]ximo|tope/i.test(line)
  );

  const discountLine = lines.find((line) =>
    /(?:[\d.,]+\s*%|\$\s*[\d,.]+)\s*(?:de\s*descuento|off)/i.test(line)
  );

  const title = normalizeDiscountTitle(discountLine || "") ||
    normalizeDiscountTitle(lines.find((line) => /%|\boff\b|^\$\s*[\d,.]+/i.test(line)) || "");

  let code = couponLine
    ? couponLine.replace(/^\s*🎟️?\s*cup[oó]n\s*:\s*/i, "")
    : "";

  if (!code) {
    code = lines.find((line) => {
      if ([title, discountLine, blockLink, minimumLine, savingLine].includes(line)) return false;
      if (/cup[oó]n\s*:|compra|ahorra|descuento|tope/i.test(line)) return false;
      return /^[A-ZÁÉÍÓÚÑ0-9_-]{3,40}$/i.test(line.replace(/\s+/g, ""));
    }) || "";
  }

  code = code.replace(/\s+/g, "").toUpperCase();
  const compraMinima = minimumLine ? extractMoney(minimumLine) : "";
  const ahorroMaximo = savingLine ? extractMoney(savingLine) : "";

  const missing = [];
  if (!title) missing.push("título");
  if (!code) missing.push("código");
  if (!link) missing.push("enlace");
  else if (!isValidImportLink(link)) missing.push("enlace válido");

  return {
    titulo: title,
    codigo: code,
    compra_minima: compraMinima,
    ahorro_maximo: ahorroMaximo,
    enlace: link,
    categoria: "tienda",
    fecha_inicio: null,
    fecha_fin: null,
    activo: true,
    valid: missing.length === 0,
    result: missing.length ? `Falta: ${missing.join(", ")}` : "Listo",
    format,
  };
}

function renderImportSummary() {
  const validCoupons = detectedCoupons.filter((item) => item.valid);
  const fixed = validCoupons.filter((item) => /^\$/i.test(item.titulo)).length;
  const percentages = validCoupons.filter((item) => /%\s*OFF/i.test(item.titulo)).length;
  const formats = [...new Set(detectedCoupons.map((item) => item.format).filter(Boolean))];
  const generalLinkApplied = importUseGeneralLink.checked && importGeneralLink.value.trim();
  const categoryLabel = importCategory.value === "bancarios" ? "💳 Bancarios" : "🛒 Tienda";
  const expirationLabel = importExpirationTime.value
    ? `${importExpirationTime.value} h (Ciudad de México)`
    : "Sin vencimiento asignado";

  importSummary.innerHTML = `
    <strong>✓ ${validCoupons.length} cupón${validCoupons.length === 1 ? "" : "es"} listo${validCoupons.length === 1 ? "" : "s"}</strong>
    <span>${fixed} de monto fijo · ${percentages} porcentual${percentages === 1 ? "" : "es"}</span>
    <span>${categoryLabel} · 🕒 ${escapeHtml(expirationLabel)}</span>
    <span>Formato: ${escapeHtml(formats.join(" y ") || "Sin identificar")}</span>
    <span>${generalLinkApplied
      ? `🔗 Liga general: ${escapeHtml(importGeneralLink.value.trim())}`
      : "🔗 Se usarán las ligas individuales."}</span>
    <span>${importPublishNew.checked ? "✨ Se publicarán como Nuevo durante una hora." : "Sin etiqueta Nuevo."}</span>
  `;
}


function getMexicoTodayDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getImportExpirationIso() {
  const time = importExpirationTime.value;
  if (!time) return null;
  return mexicoLocalToIso(`${getMexicoTodayDate()}T${time}`);
}

function analyzeImport() {
  const generalLink = importGeneralLink.value.trim();

  if (importUseGeneralLink.checked && !isValidImportLink(generalLink)) {
    detectedCoupons = [];
    importList.replaceChildren();
    importPreview.hidden = true;
    setMessage(importMessage, "Escribe una liga general válida antes de analizar.", true);
    return;
  }

  const expirationIso = getImportExpirationIso();

  detectedCoupons = importText.value
    .trim()
    .split(/\n\s*\n+/)
    .map((block) => ({
      ...parseImportBlock(block, {
        generalLink,
        useGeneralLink: importUseGeneralLink.checked,
      }),
      categoria: importCategory.value,
      fecha_fin: expirationIso,
    }))
    .filter((item) => item.titulo || item.codigo || item.enlace);

  importList.replaceChildren();

  for (const coupon of detectedCoupons) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(coupon.titulo)}</td>
      <td>${escapeHtml(coupon.codigo)}</td>
      <td>${escapeHtml(coupon.compra_minima)}</td>
      <td>${escapeHtml(coupon.ahorro_maximo)}</td>
      <td>${escapeHtml(coupon.enlace)}</td>
      <td class="${coupon.valid ? "resultado-ok" : "resultado-error"}">
        ${escapeHtml(coupon.result)}
      </td>
    `;

    importList.appendChild(row);
  }

  importPreview.hidden = detectedCoupons.length === 0;
  renderImportSummary();

  const valid = detectedCoupons.filter((item) => item.valid).length;

  setMessage(
    importMessage,
    `${valid} cupones listos de ${detectedCoupons.length} detectados. Revisa la vista previa antes de publicar.`,
    valid !== detectedCoupons.length
  );
}

async function publishImport() {
  const validCoupons = detectedCoupons.filter((item) => item.valid);

  if (!validCoupons.length) {
    setMessage(importMessage, "No hay cupones válidos para publicar.", true);
    return;
  }

  const confirmation = confirm(
    `Se publicarán ${validCoupons.length} cupón${validCoupons.length === 1 ? "" : "es"}.\n\n` +
    `${validCoupons.filter((item) => /^\$/i.test(item.titulo)).length} de monto fijo\n` +
    `${validCoupons.filter((item) => /%\s*OFF/i.test(item.titulo)).length} porcentual(es)\n` +
    `Categoría: ${importCategory.value === "bancarios" ? "Bancarios" : "Tienda"}\n` +
    `Vencimiento: ${importExpirationTime.value || "Sin vencimiento"}\n` +
    `Nuevo durante 1 hora: ${importPublishNew.checked ? "Sí" : "No"}\n\n` +
    "¿Deseas continuar?"
  );

  if (!confirmation) return;

  saveImport.disabled = true;
  let published = 0;
  const errors = [];

  try {
    for (const coupon of validCoupons) {
      try {
        await api("/api/admin-cupones", {
          method: "POST",
          body: JSON.stringify({
            ...coupon,
            publicar_como_nuevo: importPublishNew.checked,
          }),
        });
        published += 1;
      } catch (error) {
        errors.push(`${coupon.codigo}: ${error.message}`);
      }
    }

    if (errors.length === 0) {
      importText.value = "";
      importPublishNew.checked = true;
      detectedCoupons = [];
      importPreview.hidden = true;
      setMessage(importMessage, `✅ Importación finalizada: ${published} cupones publicados, 0 errores.`);
    } else {
      setMessage(
        importMessage,
        `Importación parcial: ${published} publicados y ${errors.length} con error. ${errors.join(" | ")}`,
        true
      );
    }

    await loadCoupons();
  } finally {
    saveImport.disabled = false;
  }
}


function normalizarSeccionesPublicidad(valor, categoria = "ofertas_dia") {
  let valores = [];

  if (Array.isArray(valor)) {
    valores = valor;
  } else if (typeof valor === "string") {
    const texto = valor.trim();

    if (texto) {
      try {
        const parsed = JSON.parse(texto);
        valores = Array.isArray(parsed) ? parsed : [];
      } catch {
        valores = texto
          .replace(/^\{|\}$/g, "")
          .split(",")
          .map((item) =>
            item.trim().replace(/^"|"$/g, "")
          )
          .filter(Boolean);
      }
    }
  }

  const permitidas = new Set([
    "ofertas_dia",
    "ofertas_mercado_libre",
    "ofertas_amazon",
    "comunidad_anirona",
  ]);

  const unicas = [...new Set(
    valores
      .map((item) => String(item || "").trim())
      .filter((item) => permitidas.has(item))
  )];

  const categoriaNormalizada = permitidas.has(categoria)
    ? categoria
    : "ofertas_dia";

  return unicas.length ? unicas : [categoriaNormalizada];
}


function selectedAdPlatform() {
  return (
    adPlatforms.find((input) => input.checked)?.value ||
    "mercadolibre"
  );
}

function setSelectedAdPlatform(value, link = "") {
  let platform = String(value || "").trim().toLowerCase();

  if (!["mercadolibre", "amazon"].includes(platform)) {
    const normalizedLink = String(link || "").toLowerCase();
    platform =
      normalizedLink.includes("amazon.") ||
      normalizedLink.includes("a.co/")
        ? "amazon"
        : "mercadolibre";
  }

  for (const input of adPlatforms) {
    input.checked = input.value === platform;
  }
}

function updateCouponValidationByPlatform({
  recalculate = true,
  showMessage = true,
} = {}) {
  const isAmazon = selectedAdPlatform() === "amazon";

  adPriceCoupon.disabled = isAmazon;
  adCouponCode.disabled = isAmazon;

  if (isAmazon) {
    adPriceCoupon.value = "";
    adCouponCode.value = "";

    if (showMessage) {
      adCouponRecommendation.textContent =
        "Los productos de Amazon no utilizan la validación automática de cupones.";
      adCouponRecommendation.className =
        "recomendacion-cupon sin-cupon";
    }

    return null;
  }

  adPriceCoupon.disabled = false;
  adCouponCode.disabled = false;

  return recalculate
    ? applyBestCouponToAdForm({ showMessage })
    : null;
}

function selectedAdSections() {
  return adSections
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function setSelectedAdSections(
  values = ["ofertas_dia"],
  categoria = "ofertas_dia"
) {
  const selected = new Set(
    normalizarSeccionesPublicidad(values, categoria)
  );

  for (const input of adSections) {
    input.checked = selected.has(input.value);
  }
}

const AD_SECTION_LABELS = {
  ofertas_dia: "Ofertas del día",
  ofertas_mercado_libre: "Ofertas Mercado Libre",
  ofertas_amazon: "Ofertas Amazon",
  comunidad_anirona: "Comunidad Anirona",
};


/* ================= CÁLCULO AUTOMÁTICO DE CUPONES ================= */
function parseMoney(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  let text = String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/MXN/gi, "")
    .replace(/\$/g, "");

  if (!text) return 0;

  if (text.includes(",") && text.includes(".")) {
    text = text.replace(/,/g, "");
  } else if (text.includes(",")) {
    const decimals = text.split(",").pop();
    text = decimals.length <= 2
      ? text.replace(",", ".")
      : text.replace(/,/g, "");
  } else if (text.includes(".")) {
    const parts = text.split(".");
    const last = parts.at(-1);

    if (parts.length > 2 || (last.length === 3 && parts[0].length <= 3)) {
      text = text.replace(/\./g, "");
    }
  }

  const number = Number(text.replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function formatMoney(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(number);
}

function activeStoreCoupons() {
  const now = Date.now();

  return coupons.filter((coupon) => {
    if (!coupon.activo || coupon.categoria !== "tienda") return false;

    const start = coupon.fecha_inicio
      ? new Date(coupon.fecha_inicio).getTime()
      : null;
    const end = coupon.fecha_fin
      ? new Date(coupon.fecha_fin).getTime()
      : null;

    if (start !== null && Number.isFinite(start) && start > now) return false;
    if (end !== null && Number.isFinite(end) && end <= now) return false;

    return Boolean(String(coupon.codigo || "").trim());
  });
}

function calculateCouponDiscount(coupon, productPrice) {
  const minimum = parseMoney(coupon.compra_minima);
  if (productPrice <= 0 || productPrice < minimum) return null;

  const title = String(coupon.titulo || "").toUpperCase();
  const maximum = parseMoney(coupon.ahorro_maximo);
  const percentMatch = title.match(/(\d+(?:[.,]\d+)?)\s*%/);
  const fixedMatch = title.match(/\$?\s*([\d,.]+)\s*(?:OFF|DE DESCUENTO)/i);

  let discount = 0;

  if (percentMatch) {
    const percentage = Number(percentMatch[1].replace(",", "."));
    discount = productPrice * (percentage / 100);
    if (maximum > 0) discount = Math.min(discount, maximum);
  } else if (fixedMatch) {
    discount = parseMoney(fixedMatch[1]);
    if (maximum > 0) discount = Math.min(discount, maximum);
  } else if (maximum > 0) {
    discount = maximum;
  }

  discount = Math.min(Math.max(discount, 0), productPrice);
  if (discount <= 0) return null;

  return {
    coupon,
    discount,
    finalPrice: productPrice - discount,
    minimum,
  };
}

function findBestCoupon(productPrice) {
  return activeStoreCoupons()
    .map((coupon) => calculateCouponDiscount(coupon, productPrice))
    .filter(Boolean)
    .sort((a, b) => {
      if (b.discount !== a.discount) return b.discount - a.discount;
      return b.minimum - a.minimum;
    })[0] || null;
}

function applyBestCouponToAdForm({ showMessage = true } = {}) {
  if (selectedAdPlatform() === "amazon") {
    adPriceCoupon.value = "";
    adCouponCode.value = "";

    if (showMessage) {
      adCouponRecommendation.textContent =
        "Los productos de Amazon no utilizan la validación automática de cupones.";
      adCouponRecommendation.className =
        "recomendacion-cupon sin-cupon";
    }

    return null;
  }

  const price = parseMoney(adPricePublished.value);
  const recommendation = findBestCoupon(price);

  if (!price) {
    adPriceCoupon.value = "";
    adCouponCode.value = "";

    if (showMessage) {
      adCouponRecommendation.textContent =
        "Escribe el precio publicado para calcular el mejor cupón.";
      adCouponRecommendation.className = "recomendacion-cupon";
    }

    return null;
  }

  if (!recommendation) {
    adPriceCoupon.value = "";
    adCouponCode.value = "";

    if (showMessage) {
      adCouponRecommendation.textContent =
        "No existe un cupón activo y vigente que aplique a este precio.";
      adCouponRecommendation.className =
        "recomendacion-cupon sin-cupon";
    }

    return null;
  }

  adCouponCode.value = recommendation.coupon.codigo;
  adPriceCoupon.value = formatMoney(recommendation.finalPrice);

  if (showMessage) {
    adCouponRecommendation.textContent =
      `${recommendation.coupon.codigo}: ahorro estimado de ` +
      `${formatMoney(recommendation.discount)}.`;
    adCouponRecommendation.className =
      "recomendacion-cupon con-cupon";
  }

  return recommendation;
}

function renderBulkPrices() {
  bulkPricesList.replaceChildren();

  if (!ads.length) {
    bulkPricesList.innerHTML =
      '<tr><td colspan="5">No hay productos registrados.</td></tr>';
    return;
  }

  for (const ad of ads) {
    const currentPrice = parseMoney(ad.precio_publicado);
    const platform =
      String(ad.plataforma || "").toLowerCase() === "amazon"
        ? "amazon"
        : "mercadolibre";
    const recommendation =
      platform === "amazon"
        ? null
        : findBestCoupon(currentPrice);
    const row = document.createElement("tr");

    row.dataset.id = String(ad.id);
    row.dataset.platform = platform;
    row.innerHTML = `
      <td>
        <strong>${escapeHtml(ad.titulo)}</strong>

        <a
          class="producto-enlace-revision"
          href="${escapeHtml(ad.enlace || "#")}"
          target="_blank"
          rel="noopener noreferrer"
          ${ad.enlace ? "" : 'aria-disabled="true"'}
        >
          Abrir producto en ${String(ad.enlace || "").includes("amazon") ? "Amazon" : "Mercado Libre"}
        </a>

        <small class="producto-secciones">
          ${escapeHtml(
            normalizarSeccionesPublicidad(ad.secciones, ad.categoria)
              .map((value) => AD_SECTION_LABELS[value] || value)
              .join(", ")
          )}
        </small>
      </td>
      <td>${currentPrice ? escapeHtml(formatMoney(currentPrice)) : "Sin precio"}</td>
      <td>
        <input
          class="precio-masivo-input"
          type="text"
          inputmode="decimal"
          value="${escapeHtml(ad.precio_publicado || "")}"
          data-original="${escapeHtml(ad.precio_publicado || "")}"
          aria-label="Nuevo precio de ${escapeHtml(ad.titulo)}"
          placeholder="$0"
        />
      </td>
      <td class="cupon-masivo">
        ${platform === "amazon"
          ? `<span>No aplica para Amazon</span>`
          : recommendation
            ? `<strong>${escapeHtml(recommendation.coupon.codigo)}</strong>
               <small>Ahorra ${escapeHtml(formatMoney(recommendation.discount))}</small>`
            : `<span>Sin cupón aplicable</span>`}
      </td>
      <td class="precio-final-masivo">
        ${recommendation
          ? escapeHtml(formatMoney(recommendation.finalPrice))
          : "—"}
      </td>
    `;

    bulkPricesList.appendChild(row);
  }
}

function recalculateBulkPriceRow(row) {
  const input = row.querySelector(".precio-masivo-input");
  const couponCell = row.querySelector(".cupon-masivo");
  const finalCell = row.querySelector(".precio-final-masivo");
  const price = parseMoney(input.value);
  const isAmazon = row.dataset.platform === "amazon";
  const recommendation = isAmazon ? null : findBestCoupon(price);

  row.dataset.price = price ? formatMoney(price) : "";
  row.dataset.coupon = recommendation?.coupon.codigo || "";
  row.dataset.finalPrice = recommendation
    ? formatMoney(recommendation.finalPrice)
    : "";

  if (isAmazon) {
    couponCell.innerHTML = "<span>No aplica para Amazon</span>";
    finalCell.textContent = "—";
    return;
  }

  if (!price) {
    couponCell.innerHTML = "<span>Ingresa un precio</span>";
    finalCell.textContent = "—";
    return;
  }

  if (!recommendation) {
    couponCell.innerHTML = "<span>Sin cupón aplicable</span>";
    finalCell.textContent = "—";
    return;
  }

  couponCell.innerHTML = `
    <strong>${escapeHtml(recommendation.coupon.codigo)}</strong>
    <small>Ahorra ${escapeHtml(formatMoney(recommendation.discount))}</small>
  `;
  finalCell.textContent = formatMoney(recommendation.finalPrice);
}

function recalculateAllBulkPrices() {
  bulkPricesList
    .querySelectorAll("tr[data-id]")
    .forEach(recalculateBulkPriceRow);

  setMessage(
    bulkPricesMessage,
    "Cálculos actualizados. Revisa los resultados antes de guardar."
  );
}

async function saveAllBulkPrices() {
  const rows = [...bulkPricesList.querySelectorAll("tr[data-id]")];

  const changes = rows
    .map((row) => {
      recalculateBulkPriceRow(row);

      const input = row.querySelector(".precio-masivo-input");
      const originalPrice = parseMoney(input.dataset.original);
      const currentPrice = parseMoney(input.value);

      const product = ads.find(
        (item) => Number(item.id) === Number(row.dataset.id)
      );

      const originalCoupon = String(product?.codigo_cupon || "").trim();
      const originalFinalPrice = parseMoney(product?.precio_cupon);

      const calculatedCoupon = String(row.dataset.coupon || "").trim();
      const calculatedFinalPrice = parseMoney(row.dataset.finalPrice);

      const priceChanged = currentPrice !== originalPrice;
      const couponChanged = calculatedCoupon !== originalCoupon;
      const finalPriceChanged =
        calculatedFinalPrice !== originalFinalPrice;

      if (!priceChanged && !couponChanged && !finalPriceChanged) {
        return null;
      }

      return {
        id: Number(row.dataset.id),
        precio_publicado: row.dataset.price,
        codigo_cupon: calculatedCoupon,
        precio_cupon: row.dataset.finalPrice,
        plataforma:
          product?.plataforma === "amazon"
            ? "amazon"
            : "mercadolibre",
        row,
      };
    })
    .filter(Boolean);

  if (!changes.length) {
    setMessage(bulkPricesMessage, "No hay cambios de precio o cupón para guardar.");
    return;
  }

  saveBulkPrices.disabled = true;
  recalculateBulkPrices.disabled = true;
  setMessage(
    bulkPricesMessage,
    `Actualizando ${changes.length} productos...`
  );

  const results = await Promise.allSettled(
    changes.map((change) =>
      api("/api/admin-publicidad", {
        method: "PUT",
        body: JSON.stringify({
          id: change.id,
          precio_publicado: change.precio_publicado,
          codigo_cupon: change.codigo_cupon,
          precio_cupon: change.precio_cupon,
          plataforma: change.plataforma,
        }),
      })
    )
  );

  const correct = results.filter(
    (result) => result.status === "fulfilled"
  ).length;
  const errors = results.length - correct;

  if (correct) {
    await loadAds();
  }

  setMessage(
    bulkPricesMessage,
    `${correct} productos actualizados.` +
      (errors ? ` ${errors} no pudieron guardarse.` : ""),
    errors > 0
  );

  saveBulkPrices.disabled = false;
  recalculateBulkPrices.disabled = false;
}

let adPriceTimer = null;

/* ================= PUBLICIDAD ================= */
function resetAdForm() {
  adForm.reset();
  adId.value = "";
  adImageUrl.value = "";
  adPricePublished.value = "";
  adPriceCoupon.value = "";
  adCouponCode.value = "";
  setSelectedAdSections(["ofertas_dia"]);
  setSelectedAdPlatform("mercadolibre");
  updateCouponValidationByPlatform({
    recalculate: false,
    showMessage: false,
  });
  adOrder.value = "0";
  adActive.checked = true;
  adPreviewWrapper.hidden = true;
  adPreview.src = "";
  adFormTitle.textContent = "Agregar publicidad";
  cancelAd.hidden = true;
  setMessage(adFormMessage);
  adCouponRecommendation.textContent =
    "Escribe el precio publicado para calcular el mejor cupón.";
  adCouponRecommendation.className = "recomendacion-cupon";
}

function editAd(ad) {
  adId.value = ad.id;
  adTitle.value = ad.titulo || "";
  adDescription.value = ad.descripcion || "";
  adLink.value = ad.enlace || "";
  adPricePublished.value = ad.precio_publicado || "";
  adPriceCoupon.value = ad.precio_cupon || "";
  adCouponCode.value = ad.codigo_cupon || "";
  setSelectedAdSections(ad.secciones, ad.categoria);
  setSelectedAdPlatform(ad.plataforma, ad.enlace);
  updateCouponValidationByPlatform();
  adOrder.value = ad.orden || 0;
  adActive.checked = Boolean(ad.activo);
  adImageUrl.value = ad.imagen_url || "";

  adPreview.src = ad.imagen_url;
  adPreviewWrapper.hidden = false;

  adFormTitle.textContent = `Editar: ${ad.titulo}`;
  cancelAd.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAds() {
  adList.replaceChildren();

  if (!ads.length) {
    adList.innerHTML = "<p>No hay publicidades registradas.</p>";
    return;
  }

  for (const ad of ads) {
    const item = document.createElement("article");

    item.className = "ad-item";

    item.innerHTML = `
      <img src="${escapeHtml(ad.imagen_url)}" alt="" />

      <div class="ad-info">
        <h3>${escapeHtml(ad.titulo)}</h3>
        <p>${escapeHtml(ad.descripcion || "")}</p>

        <div class="precio-admin">
          ${ad.precio_publicado
            ? `<span>Publicado: ${escapeHtml(ad.precio_publicado)}</span>`
            : ""}
          ${ad.precio_cupon
            ? `<span class="precio-cupon-admin">Con cupón: ${escapeHtml(ad.precio_cupon)}</span>`
            : ""}
          ${ad.codigo_cupon
            ? `<span>🔒 Cupón configurado</span>`
            : ""}
        </div>

        <small>
          Secciones: ${escapeHtml(
            normalizarSeccionesPublicidad(ad.secciones, ad.categoria)
              .map((value) => AD_SECTION_LABELS[value] || value)
              .join(", ")
          )} ·
          Orden: ${Number(ad.orden || 0)} ·
          Clics: ${Number(ad.clics || 0)} ·
          ${ad.activo ? "Activa" : "Inactiva"}
        </small>
      </div>

      <div class="ad-actions">
        <button class="editar" data-action="edit" data-id="${ad.id}">
          Editar
        </button>

        <button class="estado" data-action="toggle" data-id="${ad.id}">
          ${ad.activo ? "Desactivar" : "Activar"}
        </button>

        <button class="eliminar" data-action="delete" data-id="${ad.id}">
          Eliminar
        </button>
      </div>
    `;

    adList.appendChild(item);
  }
}

async function loadAds() {
  refreshAds.disabled = true;
  setMessage(adListMessage, "Cargando publicidad...");

  try {
    ads = await api("/api/admin-publicidad");
    renderAds();
    renderBulkPrices();
    setMessage(adListMessage, `${ads.length} publicidades registradas.`);
  } catch (error) {
    setMessage(adListMessage, error.message, true);
  } finally {
    refreshAds.disabled = false;
  }
}

async function optimizeImage(file) {
  const bitmap = await createImageBitmap(file);
  const maximum = 1200;
  const scale = Math.min(
    1,
    maximum / Math.max(bitmap.width, bitmap.height)
  );

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL("image/webp", 0.82);
}

async function uploadAdImage() {
  const file = adImage.files[0];

  if (!file) {
    return adImageUrl.value;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen válida.");
  }

  const dataUrl = await optimizeImage(file);

  const result = await api("/api/admin-publicidad-imagen", {
    method: "POST",
    body: JSON.stringify({
      data_url: dataUrl,
      nombre: file.name,
    }),
  });

  return result.imagen_url;
}

async function saveAd(event) {
  event.preventDefault();

  const submit = adForm.querySelector('button[type="submit"]');

  submit.disabled = true;
  setMessage(adFormMessage, "Guardando publicidad...");

  try {
    updateCouponValidationByPlatform();
    const imageUrl = await uploadAdImage();

    if (!imageUrl) {
      throw new Error("Selecciona una foto del producto.");
    }

    const secciones = selectedAdSections();

    if (!secciones.length) {
      throw new Error("Selecciona por lo menos una sección.");
    }

    const payload = {
      titulo: adTitle.value.trim(),
      descripcion: adDescription.value.trim(),
      enlace: adLink.value.trim(),
      precio_publicado: adPricePublished.value.trim(),
      precio_cupon: adPriceCoupon.value.trim(),
      codigo_cupon: adCouponCode.value.trim(),
      plataforma: selectedAdPlatform(),
      secciones: [...secciones],
      categoria: secciones[0] || "ofertas_dia",
      imagen_url: imageUrl,
      orden: Number(adOrder.value) || 0,
      activo: adActive.checked,
    };

    const id = Number(adId.value);

    await api("/api/admin-publicidad", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(id ? { id, ...payload } : payload),
    });

    resetAdForm();
    await loadAds();
  } catch (error) {
    setMessage(adFormMessage, error.message, true);
  } finally {
    submit.disabled = false;
  }
}

async function handleAdList(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const ad = ads.find((item) => Number(item.id) === id);

  if (!ad) return;

  if (button.dataset.action === "edit") {
    editAd(ad);
    return;
  }

  if (button.dataset.action === "toggle") {
    await api("/api/admin-publicidad", {
      method: "PUT",
      body: JSON.stringify({
        id,
        activo: !ad.activo,
      }),
    });

    await loadAds();
    return;
  }

  if (button.dataset.action === "delete") {
    if (!confirm(`¿Eliminar la publicidad "${ad.titulo}"?`)) return;

    await api(`/api/admin-publicidad?id=${id}`, {
      method: "DELETE",
    });

    await loadAds();
  }
}


/* ================= APARIENCIA ================= */
function updateHeroAdminPreview() {
  heroAdminPreview.style.background =
    `linear-gradient(135deg, ${heroColorStart.value}, ${heroColorEnd.value})`;

  const image =
    heroImage.files[0]
      ? heroPreview.src
      : heroImageUrl.value || "../img/logo-ofertas-transparente.png?v=63.6";

  heroAdminPreviewImage.src = image;
  if (heroAdminPreviewName) {
    heroAdminPreviewName.textContent = heroBarName?.value.trim() || "Ofertas Imperdibles MX";
  }
  if (heroAdminPreviewText) {
    heroAdminPreviewText.textContent = heroText?.value.trim() ||
      "Cupones, promociones y novedades todos los días.";
    heroAdminPreviewText.hidden = false;
  }
}

async function loadHeroConfig() {
  try {
    const config = await api("/api/admin-cupones?action=hero-config");

    siteMainLogoUrl.value = config.logo_icono_url || "";
    siteName.value = config.nombre_sitio || "Ofertas Imperdibles MX";
    siteSlogan.value = config.eslogan || "Las mejores ofertas, siempre";
    siteShowSlogan.checked = config.mostrar_eslogan !== false;
    heroBarName.value = config.nombre_barra || "Ofertas Imperdibles MX";
    siteMainLogoPreview.src = siteMainLogoUrl.value || "../img/logo-ofertas-transparente.png?v=71.6";
    siteMainLogoPreviewWrapper.hidden = false;

    heroImageUrl.value = config.imagen_url || "";
    heroColorStart.value = config.color_inicio || "#e9cdff";
    heroColorEnd.value = config.color_fin || "#fae8fa";
    heroText.value = config.texto_descriptivo || "Cupones, promociones y novedades todos los días.";
    heroStoreButtonName.value = config.nombre_boton_tienda || "Tienda";
    heroStoreSectionName.value = config.nombre_seccion_tienda || "Cupones de tienda";
    heroBankButtonName.value = config.nombre_boton_bancarios || "Bancarios";
    heroBankSectionName.value = config.nombre_seccion_bancarios || "Cupones bancarios";
    heroCommunityButtonName.value = config.nombre_boton_comunidad || "Comunidad Anirona";
    heroCommunityButtonDescription.value = config.descripcion_boton_comunidad || "Rifas, novedades y publicaciones de la comunidad";
    heroCommunitySectionName.value = config.nombre_seccion_comunidad || "Comunidad Anirona";
    heroMercadoLibreButtonName.value = config.nombre_boton_mercado_libre || "Ofertas Mercado Libre";
    heroMercadoLibreUrl.value = config.enlace_mercado_libre || "https://www.mercadolibre.com.mx/";
    heroAmazonButtonName.value = config.nombre_boton_amazon || "Ofertas Amazon";
    heroAmazonUrl.value = config.enlace_amazon || "https://www.amazon.com.mx/";
    heroWhatsappUrl.value = config.enlace_whatsapp || "https://whatsapp.com/channel/0029Vb75TftCxoAqrcjedS1n";
    heroFacebookUrl.value = config.enlace_facebook || "https://www.facebook.com/OfertasImperdiblesView";

    heroPreview.src = config.imagen_url || "";
    heroPreviewWrapper.hidden = !config.imagen_url;

    updateHeroAdminPreview();
    setMessage(heroConfigMessage);
  } catch (error) {
    setMessage(heroConfigMessage, readableError(error), true);
  }
}

async function uploadConfiguredImage(fileInput, currentUrl = "") {
  const file = fileInput?.files?.[0];
  if (!file) return currentUrl;
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen válida.");
  }
  return await optimizeImage(file);
}

async function uploadHeroImage() {
  const file = heroImage.files[0];

  if (!file) {
    return heroImageUrl.value;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen válida.");
  }

  return await optimizeImage(file);
}

async function saveHeroConfig(event) {
  event.preventDefault();
  const submit = heroConfigForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  setMessage(heroConfigMessage, "Guardando cambios...");

  try {
    const imageUrl = await uploadHeroImage();
    const mainLogoUrl = await uploadConfiguredImage(siteMainLogo, siteMainLogoUrl.value);

    const savedConfig = await api("/api/admin-cupones?action=hero-config", {
      method: "PUT",
      body: JSON.stringify({
        logo_icono_url: mainLogoUrl || "",
        nombre_sitio: siteName.value.trim(),
        eslogan: siteSlogan.value.trim(),
        mostrar_eslogan: siteShowSlogan.checked,
        nombre_barra: heroBarName.value.trim(),
        imagen_url: imageUrl || "",
        color_inicio: heroColorStart.value,
        color_fin: heroColorEnd.value,
        texto_descriptivo: heroText.value.trim(),
        nombre_boton_tienda: heroStoreButtonName.value.trim(),
        nombre_seccion_tienda: heroStoreSectionName.value.trim(),
        nombre_boton_bancarios: heroBankButtonName.value.trim(),
        nombre_seccion_bancarios: heroBankSectionName.value.trim(),
        nombre_boton_comunidad: heroCommunityButtonName.value.trim(),
        descripcion_boton_comunidad: heroCommunityButtonDescription.value.trim(),
        nombre_seccion_comunidad: heroCommunitySectionName.value.trim(),
        nombre_boton_mercado_libre: heroMercadoLibreButtonName.value.trim(),
        enlace_mercado_libre: heroMercadoLibreUrl.value.trim(),
        nombre_boton_amazon: heroAmazonButtonName.value.trim(),
        enlace_amazon: heroAmazonUrl.value.trim(),
        enlace_whatsapp: heroWhatsappUrl.value.trim(),
        enlace_facebook: heroFacebookUrl.value.trim(),
      }),
    });

    siteMainLogoUrl.value = savedConfig.logo_icono_url || mainLogoUrl || "";
    siteMainLogo.value = "";
    siteMainLogoPreview.src = siteMainLogoUrl.value || "../img/logo-ofertas-transparente.png?v=71.6";
    siteMainLogoPreviewWrapper.hidden = false;

    heroImageUrl.value = savedConfig.imagen_url || imageUrl || "";
    heroImage.value = "";
    heroPreview.src = heroImageUrl.value;
    heroPreviewWrapper.hidden = !heroImageUrl.value;
    updateHeroAdminPreview();
    setMessage(heroConfigMessage, "Cambios guardados correctamente.");
  } catch (error) {
    setMessage(heroConfigMessage, readableError(error), true);
  } finally {
    submit.disabled = false;
  }
}

/* Eventos */
loginButton.addEventListener("click", login);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

logoutButton.addEventListener("click", logout);
tabCoupons.addEventListener("click", () => showSection("cupones"));
tabAds.addEventListener("click", () => showSection("publicidad"));
tabEvents?.addEventListener("click", () => showSection("eventos"));
tabAppearance.addEventListener("click", () => showSection("apariencia"));

couponForm.addEventListener("submit", saveCoupon);
couponList.addEventListener("click", handleCouponList);
refreshCoupons.addEventListener("click", loadCoupons);
generateShareSummary?.addEventListener("click", createShareSummary);
copyShareSummaryText?.addEventListener("click", copyGeneratedShareText);
downloadShareSummaryImage?.addEventListener("click", downloadGeneratedShareImage);
shareShareSummaryImage?.addEventListener("click", shareGeneratedImage);
newCoupon.addEventListener("click", resetCouponForm);
cancelCoupon.addEventListener("click", resetCouponForm);

couponImage.addEventListener("change", () => {
  const file = couponImage.files[0];

  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  couponImagePreview.src = objectUrl;
  couponImagePreviewWrapper.hidden = false;
});

couponImageRemove.addEventListener("click", () => {
  couponImage.value = "";
  couponImageUrl.value = "";
  couponImagePreview.src = "";
  couponImagePreviewWrapper.hidden = true;
});

showImporter.addEventListener("click", () => {
  importerPanel.hidden = false;
});

closeImporter.addEventListener("click", () => {
  importerPanel.hidden = true;
});

let importPreviewTimer = 0;
function scheduleImportPreview() {
  window.clearTimeout(importPreviewTimer);
  importPreviewTimer = window.setTimeout(() => {
    if (importText.value.trim()) {
      analyzeImport();
    } else {
      detectedCoupons = [];
      importList.replaceChildren();
      importPreview.hidden = true;
      setMessage(importMessage);
    }
  }, 280);
}

processImport.addEventListener("click", analyzeImport);
importUseGeneralLink.addEventListener("change", () => {
  importGeneralLink.disabled = !importUseGeneralLink.checked;
  scheduleImportPreview();
});
[importText, importGeneralLink, importCategory, importExpirationTime, importPublishNew].forEach((control) => {
  control?.addEventListener("input", scheduleImportPreview);
  control?.addEventListener("change", scheduleImportPreview);
});
importGeneralLink.disabled = true;
clearImport.addEventListener("click", () => {
  importText.value = "";
  importGeneralLink.value = "";
  importUseGeneralLink.checked = false;
  importCategory.value = "tienda";
  importExpirationTime.value = "23:59";
  importPublishNew.checked = true;
  detectedCoupons = [];
  importList.replaceChildren();
  importPreview.hidden = true;
  setMessage(importMessage);
});

saveImport.addEventListener("click", publishImport);

adForm.addEventListener("submit", saveAd);
adList.addEventListener("click", handleAdList);
refreshAds.addEventListener("click", loadAds);
newAd.addEventListener("click", resetAdForm);
cancelAd.addEventListener("click", resetAdForm);

for (const input of adPlatforms) {
  input.addEventListener("change", () => {
    updateCouponValidationByPlatform();
  });
}

adPricePublished.addEventListener("input", () => {
  window.clearTimeout(adPriceTimer);
  adPriceTimer = window.setTimeout(() => {
    applyBestCouponToAdForm();
  }, 300);
});

adPricePublished.addEventListener("change", () => {
  applyBestCouponToAdForm();
});

bulkPricesList.addEventListener("input", (event) => {
  const input = event.target.closest(".precio-masivo-input");
  if (!input) return;
  const row = input.closest("tr[data-id]");
  if (row) recalculateBulkPriceRow(row);
});

recalculateBulkPrices.addEventListener("click", recalculateAllBulkPrices);
saveBulkPrices.addEventListener("click", saveAllBulkPrices);

[heroText, heroColorStart, heroColorEnd].forEach((input) => {
  input?.addEventListener("input", updateHeroAdminPreview);
});
siteMainLogo?.addEventListener("change", () => {
  const file = siteMainLogo.files?.[0];
  if (!file) return;
  const objectUrl = URL.createObjectURL(file);
  siteMainLogoPreview.src = objectUrl;
  siteMainLogoPreviewWrapper.hidden = false;
});
siteMainLogoRemove?.addEventListener("click", () => {
  siteMainLogo.value = "";
  siteMainLogoUrl.value = "";
  siteMainLogoPreview.src = "../img/logo-ofertas-transparente.png?v=71.6";
  siteMainLogoPreviewWrapper.hidden = false;
});
[siteName, siteSlogan, siteShowSlogan, heroBarName].forEach((element) => {
  element?.addEventListener("input", updateHeroAdminPreview);
  element?.addEventListener("change", updateHeroAdminPreview);
});

heroConfigForm.addEventListener("submit", saveHeroConfig);

heroColorStart.addEventListener("input", updateHeroAdminPreview);
heroColorEnd.addEventListener("input", updateHeroAdminPreview);

heroImage.addEventListener("change", () => {
  const file = heroImage.files[0];
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  heroPreview.src = objectUrl;
  heroPreviewWrapper.hidden = false;
  updateHeroAdminPreview();
});

heroRemoveImage.addEventListener("click", () => {
  heroImage.value = "";
  heroImageUrl.value = "";
  heroPreview.src = "";
  heroPreviewWrapper.hidden = true;
  updateHeroAdminPreview();
});

adImage.addEventListener("change", async () => {
  const file = adImage.files[0];

  if (!file) return;

  const dataUrl = await optimizeImage(file);

  adPreview.src = dataUrl;
  adPreviewWrapper.hidden = false;
});

if (adminPassword) {
  login();
}


/* ================= EVENTOS Y RIFAS V68.0.1 ================= */
{
const $=s=>document.querySelector(s);const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const tab=$('#tab-eventos'),section=$('#seccion-eventos'),otherTabs=['#tab-cupones','#tab-publicidad','#tab-apariencia'],otherSections=['#seccion-cupones','#seccion-publicidad','#seccion-apariencia'];
let events=[],selected=null,participants=[],winners=[];
const password=()=>sessionStorage.getItem('adminPassword')||'';
async function api(url,opt={}){const r=await fetch(url,{...opt,headers:{'Content-Type':'application/json','x-admin-password':password(),...(opt.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No fue posible completar la operación.');return d;}
const msg=(el,text='',error=false)=>{el.textContent=text;el.classList.toggle('error',error)};
const formatNo=n=>String(n||0).padStart(6,'0');
const dateText=v=>v?new Intl.DateTimeFormat('es-MX',{dateStyle:'short',timeStyle:'short',timeZone:'America/Mexico_City'}).format(new Date(v)):'—';
function isoToLocal(v){if(!v)return'';const d=new Date(v),parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d);const o=Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return `${o.year}-${o.month}-${o.day}T${o.hour}:${o.minute}`;}
function localToIso(v){if(!v)return null;return new Date(v+':00-06:00').toISOString();}
tab?.addEventListener('click',()=>{otherTabs.forEach(x=>$(x)?.classList.remove('activo'));otherSections.forEach(x=>{if($(x))$(x).hidden=true});tab.classList.add('activo');section.hidden=false;loadEvents();});
otherTabs.forEach(x=>$(x)?.addEventListener('click',()=>{tab?.classList.remove('activo');if(section)section.hidden=true;}));
function resetForm(){selected=null;$('#evento-form').reset();$('#evento-id').value='';$('#evento-prefijo').value='ANI';$('#evento-limite').value='500';$('#evento-ganadores').value='1';$('#evento-mostrar-contador').checked=true;$('#evento-publicar-ganador').checked=true;$('#evento-form-titulo').textContent='Crear evento';$('#evento-imagen-url').value='';$('#evento-imagen-preview').hidden=true;msg($('#evento-form-mensaje'));}
async function loadEvents(){msg($('#eventos-lista-mensaje'),'Cargando…');try{events=await api('/api/admin-cupones?action=eventos');renderEvents();msg($('#eventos-lista-mensaje'));}catch(e){msg($('#eventos-lista-mensaje'),e.message,true);}}
function renderEvents(){const root=$('#eventos-lista');if(!events.length){root.innerHTML='<p>No hay eventos creados.</p>';return;}root.innerHTML=events.map(e=>`<article class="evento-admin-card ${selected?.id===e.id?'activo':''}"><span class="estado-chip ${esc(e.estado)}">${esc(e.estado)}</span><h4>${esc(e.nombre)}</h4><p>${esc(e.producto_nombre)}</p><div class="evento-admin-meta"><span>👥 ${e.participantes_count}/${e.limite_boletos}</span><span>🏆 ${e.cantidad_ganadores}</span><span>📅 ${dateText(e.fecha_sorteo)}</span></div><div class="evento-admin-acciones"><button class="boton-secundario" data-open="${e.id}" type="button">Ver</button><button class="boton-secundario" data-edit="${e.id}" type="button">Editar</button><button class="boton-peligro" data-delete="${e.id}" type="button">Eliminar</button></div></article>`).join('');root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openEvent(Number(b.dataset.open)));root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editEvent(Number(b.dataset.edit)));root.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteEvent(Number(b.dataset.delete)));}
function editEvent(id){const e=events.find(x=>x.id===id);if(!e)return;selected=e;$('#evento-id').value=e.id;$('#evento-nombre').value=e.nombre;$('#evento-tipo').value=e.tipo;$('#evento-prefijo').value=e.prefijo;$('#evento-producto').value=e.producto_nombre;$('#evento-plataforma').value=e.premio_plataforma||'Mercado Libre';$('#evento-enlace').value=e.premio_enlace||'';$('#evento-cupon').value=e.premio_cupon||'';$('#evento-descripcion').value=e.descripcion;$('#evento-imagen-url').value=e.imagen_url;$('#evento-fecha').value=isoToLocal(e.fecha_sorteo);$('#evento-limite').value=e.limite_boletos;$('#evento-ganadores').value=e.cantidad_ganadores;$('#evento-estado').value=e.estado;$('#evento-mostrar-contador').checked=e.mostrar_contador;$('#evento-mostrar-participantes').checked=e.mostrar_participantes;$('#evento-publicar-ganador').checked=e.publicar_ganador;$('#evento-form-titulo').textContent='Editar evento';const im=$('#evento-imagen-preview');if(e.imagen_url){im.src=e.imagen_url;im.hidden=false}else im.hidden=true;window.scrollTo({top:section.offsetTop,behavior:'smooth'});renderEvents();}
async function uploadImage(file){const reader=new FileReader();const dataUrl=await new Promise((ok,no)=>{reader.onload=()=>ok(reader.result);reader.onerror=no;reader.readAsDataURL(file)});const d=await api('/api/admin-publicidad-imagen',{method:'POST',body:JSON.stringify({data_url:dataUrl,nombre:file.name})});return d.imagen_url;}
$('#evento-imagen')?.addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;msg($('#evento-form-mensaje'),'Subiendo imagen…');try{const url=await uploadImage(file);$('#evento-imagen-url').value=url;$('#evento-imagen-preview').src=url;$('#evento-imagen-preview').hidden=false;msg($('#evento-form-mensaje'),'Imagen lista.')}catch(err){msg($('#evento-form-mensaje'),err.message,true);}});
$('#evento-form')?.addEventListener('submit',async ev=>{ev.preventDefault();const id=Number($('#evento-id').value||0),body={id,nombre:$('#evento-nombre').value,tipo:$('#evento-tipo').value,prefijo:$('#evento-prefijo').value,producto_nombre:$('#evento-producto').value,premio_plataforma:$('#evento-plataforma').value,premio_enlace:$('#evento-enlace').value,premio_cupon:$('#evento-cupon').value,descripcion:$('#evento-descripcion').value,imagen_url:$('#evento-imagen-url').value,fecha_sorteo:localToIso($('#evento-fecha').value),limite_boletos:Number($('#evento-limite').value),cantidad_ganadores:Number($('#evento-ganadores').value),estado:$('#evento-estado').value,mostrar_contador:$('#evento-mostrar-contador').checked,mostrar_participantes:$('#evento-mostrar-participantes').checked,publicar_ganador:$('#evento-publicar-ganador').checked};msg($('#evento-form-mensaje'),'Guardando…');try{await api('/api/admin-cupones?action=eventos',{method:id?'PUT':'POST',body:JSON.stringify(body)});msg($('#evento-form-mensaje'),'Evento guardado correctamente.');resetForm();await loadEvents();}catch(e){msg($('#evento-form-mensaje'),e.message,true);}});
async function deleteEvent(id){if(!confirm('¿Eliminar este evento y todos sus registros? Esta acción no se puede deshacer.'))return;try{await api(`/api/admin-cupones?action=eventos&id=${id}`,{method:'DELETE'});if(selected?.id===id){selected=null;$('#evento-detalle').hidden=true}await loadEvents();}catch(e){alert(e.message);}}
async function openEvent(id){selected=events.find(x=>x.id===id);if(!selected)return;$('#evento-detalle').hidden=false;$('#evento-detalle-titulo').textContent=selected.nombre;$('#evento-detalle-subtitulo').textContent=selected.producto_nombre;renderEvents();await loadDetail();}
async function loadDetail(){msg($('#evento-detalle-mensaje'),'Cargando registros…');try{[participants,winners]=await Promise.all([api(`/api/admin-cupones?action=eventos-participantes&evento_id=${selected.id}`),api(`/api/admin-cupones?action=eventos-ganadores&evento_id=${selected.id}`)]);renderDetail();msg($('#evento-detalle-mensaje'));}catch(e){msg($('#evento-detalle-mensaje'),e.message,true);}}
function renderDetail(){const e=selected;$('#evento-stat-participantes').textContent=participants.length;$('#evento-stat-disponibles').textContent=Math.max(0,e.limite_boletos-participants.length);$('#evento-stat-ganadores').textContent=winners.length;$('#evento-stat-estado').textContent=e.estado;renderParticipants();renderWinners();}
function renderParticipants(filter=''){const q=filter.toLowerCase().trim(),rows=participants.filter(p=>!q||[p.numero,p.codigo,p.nombre,p.telefono,p.ciudad].some(v=>String(v||'').toLowerCase().includes(q)));$('#evento-participantes-lista').innerHTML=rows.map(p=>`<tr><td>${formatNo(p.numero)}</td><td>${esc(p.codigo)}</td><td>${esc(p.nombre)}</td><td>${esc(p.telefono)}</td><td>${esc(p.ciudad)}</td><td>${dateText(p.fecha_registro)}</td></tr>`).join('')||'<tr><td colspan="6">Sin participantes.</td></tr>';}
function renderWinners(){$('#evento-ganadores-lista').innerHTML=winners.map(w=>`<div class="ganador-admin"><span>🏆 Ganador ${w.posicion}</span><strong>${formatNo(w.participantes_evento?.numero)} · ${esc(w.participantes_evento?.nombre)}</strong><p>${esc(w.participantes_evento?.telefono)} · ${esc(w.participantes_evento?.codigo)}</p><div class="acciones"><button class="boton-secundario" data-publish="${w.id}" data-value="${!w.publicado}" type="button">${w.publicado?'Ocultar':'Publicar'}</button><button class="boton-secundario" data-delivered="${w.id}" data-value="${!w.premio_entregado}" type="button">${w.premio_entregado?'✓ Premio entregado':'Marcar entregado'}</button><a class="boton-secundario" target="_blank" href="https://wa.me/52${esc(w.participantes_evento?.telefono)}?text=${encodeURIComponent(`🎉 ¡Felicidades! Tu número ${formatNo(w.participantes_evento?.numero)} resultó ganador de ${selected.nombre}. Comunícate con nosotros para validar y coordinar la entrega.`)}">WhatsApp</a></div></div>`).join('')||'<p>Aún no hay ganadores.</p>';document.querySelectorAll('[data-publish]').forEach(b=>b.onclick=()=>updateWinner(Number(b.dataset.publish),{publicado:b.dataset.value==='true'}));document.querySelectorAll('[data-delivered]').forEach(b=>b.onclick=()=>updateWinner(Number(b.dataset.delivered),{premio_entregado:b.dataset.value==='true'}));}
async function updateWinner(id,data){try{await api('/api/admin-cupones?action=eventos-ganador',{method:'PATCH',body:JSON.stringify({id,...data})});await loadDetail();}catch(e){alert(e.message);}}
$('#evento-buscar')?.addEventListener('input',e=>renderParticipants(e.target.value));
$('#evento-sortear')?.addEventListener('click',async()=>{if(!selected||!confirm(`¿Elegir al azar ${selected.cantidad_ganadores-winners.length} ganador(es) entre los participantes activos?`))return;msg($('#evento-detalle-mensaje'),'🎲 Realizando sorteo…');try{await api('/api/admin-cupones?action=eventos-sortear',{method:'POST',body:JSON.stringify({evento_id:selected.id})});await loadEvents();selected=events.find(x=>x.id===selected.id)||selected;await loadDetail();msg($('#evento-detalle-mensaje'),'🏆 Sorteo realizado y ganador publicado.');}catch(e){msg($('#evento-detalle-mensaje'),e.message,true);}});
$('#evento-cerrar')?.addEventListener('click',async()=>{if(!selected)return;try{await api('/api/admin-cupones?action=eventos',{method:'PUT',body:JSON.stringify({...selected,estado:'cerrada'})});await loadEvents();selected=events.find(x=>x.id===selected.id);await loadDetail();}catch(e){alert(e.message);}});
$('#evento-exportar')?.addEventListener('click',()=>{if(!selected)return;const cells=v=>`"${String(v??'').replaceAll('"','""')}"`;const csv=['Número,Código,Nombre,Teléfono,Ciudad,Fecha',...participants.map(p=>[formatNo(p.numero),p.codigo,p.nombre,p.telefono,p.ciudad,p.fecha_registro].map(cells).join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.download=`participantes-${selected.nombre.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.csv`;a.click();URL.revokeObjectURL(a.href);});
$('.evento-admin-tabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-evento-vista]');if(!b)return;document.querySelectorAll('.evento-admin-tab').forEach(x=>x.classList.toggle('activo',x===b));$('#evento-vista-participantes').hidden=b.dataset.eventoVista!=='participantes';$('#evento-vista-ganadores').hidden=b.dataset.eventoVista!=='ganadores';});
$('#evento-nuevo')?.addEventListener('click',resetForm);$('#evento-cancelar')?.addEventListener('click',resetForm);$('#evento-actualizar')?.addEventListener('click',loadEvents);

}
