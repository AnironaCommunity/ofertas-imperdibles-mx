const loginPanel = document.querySelector("#login-panel");
const adminPanel = document.querySelector("#admin-panel");
const passwordInput = document.querySelector("#admin-password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#cerrar-sesion");

const tabCoupons = document.querySelector("#tab-cupones");
const tabAds = document.querySelector("#tab-publicidad");
const couponsSection = document.querySelector("#seccion-cupones");
const adsSection = document.querySelector("#seccion-publicidad");

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
const couponActive = document.querySelector("#coupon-active");
const couponPublishNew = document.querySelector("#coupon-publish-new");
const couponFormTitle = document.querySelector("#coupon-form-title");
const couponFormMessage = document.querySelector("#coupon-form-message");
const cancelCoupon = document.querySelector("#cancelar-cupon");
const newCoupon = document.querySelector("#nuevo-cupon");
const refreshCoupons = document.querySelector("#actualizar-cupones");
const couponList = document.querySelector("#coupon-list");
const couponListMessage = document.querySelector("#coupon-list-message");

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
    throw new Error(data.error || "No fue posible completar la operación.");
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

  tabCoupons.classList.toggle("activo", isCoupons);
  tabAds.classList.toggle("activo", !isCoupons);

  couponsSection.hidden = !isCoupons;
  adsSection.hidden = isCoupons;
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

async function saveCoupon(event) {
  event.preventDefault();

  const submit = couponForm.querySelector('button[type="submit"]');
  const id = Number(couponId.value);

  const payload = {
    titulo: couponTitle.value.trim(),
    codigo: couponCode.value.trim(),
    compra_minima: couponMinimum.value.trim(),
    ahorro_maximo: couponSaving.value.trim(),
    categoria: couponCategory.value,
    fecha_inicio: mexicoLocalToIso(couponStart.value),
    fecha_fin: mexicoLocalToIso(couponEnd.value),
    enlace: couponLink.value.trim(),
    activo: couponActive.checked,
    publicar_como_nuevo: couponPublishNew.checked,
  };

  submit.disabled = true;

  try {
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

function extractMoney(line) {
  const match = line.match(/\$?\s*[\d,.]+/);
  return match ? match[0].replace(/\s+/g, "") : "";
}

function parseImportBlock(block) {
  const lines = block
    .split("\n")
    .map(normalizeLine)
    .filter(Boolean);

  const link = lines.find((line) => /^https?:\/\/\S+/i.test(line)) || "";

  const minimumLine = lines.find((line) =>
    /compra\s*m[ií]nima|m[ií]nimo/i.test(line)
  );

  const savingLine = lines.find((line) =>
    /ahorra\s*hasta|descuento\s*m[aá]ximo|tope/i.test(line)
  );

  const title =
    lines.find((line) =>
      /%|\boff\b|^\$\s*[\d,.]+/i.test(line)
    ) || lines[0] || "";

  const code =
    lines.find((line) => {
      if ([title, link, minimumLine, savingLine].includes(line)) return false;
      if (/compra|ahorra|descuento|tope/i.test(line)) return false;
      return /^[A-ZÁÉÍÓÚÑ0-9_-]{3,40}$/i.test(line.replace(/\s+/g, ""));
    }) || "";

  return {
    titulo: title,
    codigo: code.replace(/\s+/g, ""),
    compra_minima: minimumLine ? extractMoney(minimumLine) : "",
    ahorro_maximo: savingLine ? extractMoney(savingLine) : "",
    enlace: link,
    categoria: "tienda",
    fecha_inicio: null,
    fecha_fin: null,
    activo: true,
    valid: Boolean(title && code && link),
    result: "",
  };
}

function analyzeImport() {
  detectedCoupons = importText.value
    .trim()
    .split(/\n\s*\n+/)
    .map(parseImportBlock)
    .filter((item) =>
      item.titulo || item.codigo || item.enlace
    );

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
        ${coupon.valid ? "Listo" : "Revisar"}
      </td>
    `;

    importList.appendChild(row);
  }

  importPreview.hidden = detectedCoupons.length === 0;

  const valid = detectedCoupons.filter((item) => item.valid).length;

  setMessage(
    importMessage,
    `${valid} cupones listos de ${detectedCoupons.length} detectados.`,
    valid !== detectedCoupons.length
  );
}

async function publishImport() {
  const validCoupons = detectedCoupons.filter((item) => item.valid);

  saveImport.disabled = true;

  try {
    for (const coupon of validCoupons) {
      await api("/api/admin-cupones", {
        method: "POST",
        body: JSON.stringify({
          ...coupon,
          publicar_como_nuevo: importPublishNew.checked,
        }),
      });
    }

    importText.value = "";
    importPublishNew.checked = true;
    detectedCoupons = [];
    importPreview.hidden = true;
    setMessage(importMessage, `${validCoupons.length} cupones publicados.`);
    await loadCoupons();
  } catch (error) {
    setMessage(importMessage, error.message, true);
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
    const recommendation = findBestCoupon(currentPrice);
    const row = document.createElement("tr");

    row.dataset.id = String(ad.id);
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
        ${recommendation
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
  const recommendation = findBestCoupon(price);

  row.dataset.price = price ? formatMoney(price) : "";
  row.dataset.coupon = recommendation?.coupon.codigo || "";
  row.dataset.finalPrice = recommendation
    ? formatMoney(recommendation.finalPrice)
    : "";

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
  applyBestCouponToAdForm();
  setSelectedAdSections(ad.secciones, ad.categoria);
  setSelectedAdPlatform(ad.plataforma, ad.enlace);
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
    applyBestCouponToAdForm();
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

/* Eventos */
loginButton.addEventListener("click", login);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

logoutButton.addEventListener("click", logout);
tabCoupons.addEventListener("click", () => showSection("cupones"));
tabAds.addEventListener("click", () => showSection("publicidad"));

couponForm.addEventListener("submit", saveCoupon);
couponList.addEventListener("click", handleCouponList);
refreshCoupons.addEventListener("click", loadCoupons);
newCoupon.addEventListener("click", resetCouponForm);
cancelCoupon.addEventListener("click", resetCouponForm);

showImporter.addEventListener("click", () => {
  importerPanel.hidden = false;
});

closeImporter.addEventListener("click", () => {
  importerPanel.hidden = true;
});

processImport.addEventListener("click", analyzeImport);
clearImport.addEventListener("click", () => {
  importText.value = "";
  detectedCoupons = [];
  importPreview.hidden = true;
  setMessage(importMessage);
});

saveImport.addEventListener("click", publishImport);

adForm.addEventListener("submit", saveAd);
adList.addEventListener("click", handleAdList);
refreshAds.addEventListener("click", loadAds);
newAd.addEventListener("click", resetAdForm);
cancelAd.addEventListener("click", resetAdForm);

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
