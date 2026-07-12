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
const couponLink = document.querySelector("#coupon-link");
const couponActive = document.querySelector("#coupon-active");
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
const importList = document.querySelector("#import-list");

/* Publicidad */
const adForm = document.querySelector("#ad-form");
const adId = document.querySelector("#ad-id");
const adImageUrl = document.querySelector("#ad-image-url");
const adTitle = document.querySelector("#ad-title");
const adDescription = document.querySelector("#ad-description");
const adLink = document.querySelector("#ad-link");
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

function resetCouponForm() {
  couponForm.reset();
  couponId.value = "";
  couponCategory.value = "tienda";
  couponActive.checked = true;
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
  couponLink.value = coupon.enlace || "";
  couponActive.checked = Boolean(coupon.activo);

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

    row.innerHTML = `
      <td>${escapeHtml(coupon.titulo)}</td>
      <td>${escapeHtml(coupon.codigo)}</td>
      <td>${coupon.categoria === "bancarios" ? "💳 Bancarios" : "🛒 Tienda"}</td>
      <td>${Number(coupon.clics || 0)}</td>
      <td>${coupon.activo ? "Activo" : "Inactivo"}</td>
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
    enlace: couponLink.value.trim(),
    activo: couponActive.checked,
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
        body: JSON.stringify(coupon),
      });
    }

    importText.value = "";
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

/* ================= PUBLICIDAD ================= */
function resetAdForm() {
  adForm.reset();
  adId.value = "";
  adImageUrl.value = "";
  adOrder.value = "0";
  adActive.checked = true;
  adPreviewWrapper.hidden = true;
  adPreview.src = "";
  adFormTitle.textContent = "Agregar publicidad";
  cancelAd.hidden = true;
  setMessage(adFormMessage);
}

function editAd(ad) {
  adId.value = ad.id;
  adTitle.value = ad.titulo || "";
  adDescription.value = ad.descripcion || "";
  adLink.value = ad.enlace || "";
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
        <small>
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
    const imageUrl = await uploadAdImage();

    if (!imageUrl) {
      throw new Error("Selecciona una foto del producto.");
    }

    const payload = {
      titulo: adTitle.value.trim(),
      descripcion: adDescription.value.trim(),
      enlace: adLink.value.trim(),
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
