const loginPanel = document.querySelector("#login-panel");
const adminPanel = document.querySelector("#admin-panel");
const passwordInput = document.querySelector("#admin-password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#cerrar-sesion");

const couponForm = document.querySelector("#coupon-form");
const couponId = document.querySelector("#coupon-id");
const titleInput = document.querySelector("#titulo");
const codeInput = document.querySelector("#codigo");
const minimumInput = document.querySelector("#compra-minima");
const savingInput = document.querySelector("#ahorro-maximo");
const linkInput = document.querySelector("#enlace");
const activeInput = document.querySelector("#activo");
const categoryInput = document.querySelector("#categoria");
const formTitle = document.querySelector("#form-title");
const formMessage = document.querySelector("#form-message");
const cancelEditButton = document.querySelector("#cancelar-edicion");

const couponList = document.querySelector("#coupon-list");
const listMessage = document.querySelector("#list-message");
const refreshButton = document.querySelector("#actualizar-lista");
const newCouponButton = document.querySelector("#nuevo-cupon");

const importerPanel = document.querySelector("#importador-panel");
const showImporterButton = document.querySelector("#mostrar-importador");
const closeImporterButton = document.querySelector("#cerrar-importador");
const importText = document.querySelector("#texto-importacion");
const processImportButton = document.querySelector("#procesar-importacion");
const clearImportButton = document.querySelector("#limpiar-importacion");
const saveImportButton = document.querySelector("#guardar-importacion");
const importMessage = document.querySelector("#import-message");
const importPreview = document.querySelector("#import-preview");
const importList = document.querySelector("#import-list");

let adminPassword = sessionStorage.getItem("adminPassword") || "";
let coupons = [];
let detectedCoupons = [];

function setMessage(element, message = "", isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

async function adminRequest(url, options = {}) {
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
  const password = passwordInput.value.trim();

  if (!password) {
    setMessage(loginMessage, "Ingresa la contraseña.", true);
    return;
  }

  loginButton.disabled = true;
  setMessage(loginMessage, "Verificando acceso...");

  try {
    adminPassword = password;
    await adminRequest("/api/admin-cupones");

    sessionStorage.setItem("adminPassword", password);
    loginPanel.style.display = "none";
    adminPanel.style.display = "block";
    setMessage(loginMessage);
    await loadCoupons();
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
  adminPanel.style.display = "none";
  loginPanel.style.display = "block";
  passwordInput.value = "";
  setMessage(loginMessage, "Sesión cerrada.");
}

function resetForm() {
  couponForm.reset();
  couponId.value = "";
  activeInput.checked = true;
  categoryInput.value = "tienda";
  formTitle.textContent = "Agregar cupón";
  cancelEditButton.hidden = true;
  setMessage(formMessage);
  titleInput.focus();
}

function fillForm(coupon) {
  couponId.value = coupon.id;
  titleInput.value = coupon.titulo || "";
  codeInput.value = coupon.codigo || "";
  minimumInput.value = coupon.compra_minima || "";
  savingInput.value = coupon.ahorro_maximo || "";
  linkInput.value = coupon.enlace || "";
  activeInput.checked = Boolean(coupon.activo);
  categoryInput.value = coupon.categoria === "bancarios" ? "bancarios" : "tienda";

  formTitle.textContent = `Editar cupón: ${coupon.titulo}`;
  cancelEditButton.hidden = false;
  setMessage(formMessage);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function renderCoupons() {
  couponList.replaceChildren();

  if (!coupons.length) {
    const row = document.createElement("tr");
    row.innerHTML = '<td colspan="7">No hay cupones registrados.</td>';
    couponList.appendChild(row);
    return;
  }

  for (const coupon of coupons) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(coupon.titulo)}</td>
      <td>${escapeHtml(coupon.codigo)}</td>
      <td>${escapeHtml(coupon.compra_minima || "")}</td>
      <td>${escapeHtml(coupon.ahorro_maximo || "")}</td>
      <td>${Number(coupon.clics || 0)}</td>
      <td class="${coupon.activo ? "estado-activo" : "estado-inactivo"}">
        ${coupon.activo ? "Activo" : "Inactivo"}
      </td>
      <td>
        <div class="acciones-tabla">
          <button class="boton-editar" data-action="edit" data-id="${coupon.id}">
            Editar
          </button>

          <button class="boton-estado" data-action="toggle" data-id="${coupon.id}">
            ${coupon.activo ? "Desactivar" : "Activar"}
          </button>

          <button class="boton-eliminar" data-action="delete" data-id="${coupon.id}">
            Eliminar
          </button>
        </div>
      </td>
    `;

    couponList.appendChild(row);
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadCoupons() {
  refreshButton.disabled = true;
  setMessage(listMessage, "Cargando cupones...");

  try {
    coupons = await adminRequest("/api/admin-cupones");
    renderCoupons();
    setMessage(listMessage, `${coupons.length} cupones encontrados.`);
  } catch (error) {
    setMessage(listMessage, error.message, true);

    if (error.message.toLowerCase().includes("contraseña")) {
      logout();
    }
  } finally {
    refreshButton.disabled = false;
  }
}

async function saveCoupon(event) {
  event.preventDefault();

  const id = Number(couponId.value);
  const payload = {
    titulo: titleInput.value.trim(),
    codigo: codeInput.value.trim(),
    compra_minima: minimumInput.value.trim(),
    ahorro_maximo: savingInput.value.trim(),
    enlace: linkInput.value.trim(),
    activo: activeInput.checked,
    categoria: categoryInput.value,
  };

  if (!payload.titulo || !payload.codigo || !payload.enlace) {
    setMessage(
      formMessage,
      "Título, código y enlace son obligatorios.",
      true
    );
    return;
  }

  const submitButton = couponForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    if (id) {
      await adminRequest("/api/admin-cupones", {
        method: "PUT",
        body: JSON.stringify({
          id,
          ...payload,
        }),
      });

      setMessage(formMessage, "Cupón actualizado correctamente.");
    } else {
      await adminRequest("/api/admin-cupones", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMessage(formMessage, "Cupón agregado correctamente.");
    }

    await loadCoupons();
    resetForm();
  } catch (error) {
    setMessage(formMessage, error.message, true);
  } finally {
    submitButton.disabled = false;
  }
}

async function handleTableAction(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const coupon = coupons.find((item) => Number(item.id) === id);

  if (!coupon) return;

  const action = button.dataset.action;

  if (action === "edit") {
    fillForm(coupon);
    return;
  }

  if (action === "toggle") {
    button.disabled = true;

    try {
      await adminRequest("/api/admin-cupones", {
        method: "PUT",
        body: JSON.stringify({
          id,
          activo: !coupon.activo,
        }),
      });

      await loadCoupons();
    } catch (error) {
      setMessage(listMessage, error.message, true);
    } finally {
      button.disabled = false;
    }

    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el cupón "${coupon.titulo}"?`
    );

    if (!confirmed) return;

    button.disabled = true;

    try {
      await adminRequest(`/api/admin-cupones?id=${id}`, {
        method: "DELETE",
      });

      await loadCoupons();

      if (Number(couponId.value) === id) {
        resetForm();
      }
    } catch (error) {
      setMessage(listMessage, error.message, true);
    } finally {
      button.disabled = false;
    }
  }
}

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

function looksLikeUrl(line) {
  return /^https?:\/\/\S+/i.test(line);
}

function looksLikeCondition(line) {
  return /compra\s*m[ií]nima|m[ií]nimo|ahorra\s*hasta|descuento\s*m[aá]ximo|tope/i.test(line);
}

function looksLikeTitle(line) {
  return (
    /%/.test(line) ||
    /\boff\b/i.test(line) ||
    /^\$\s*[\d,.]+/.test(line) ||
    /descuento/i.test(line)
  );
}

function parseBlock(block) {
  const lines = block
    .split("\n")
    .map(normalizeLine)
    .filter(Boolean);

  const urlIndex = lines.findIndex(looksLikeUrl);
  const enlace = urlIndex >= 0 ? lines[urlIndex] : "";

  const minimumLine = lines.find((line) =>
    /compra\s*m[ií]nima|m[ií]nimo/i.test(line)
  );

  const savingLine = lines.find((line) =>
    /ahorra\s*hasta|descuento\s*m[aá]ximo|tope/i.test(line)
  );

  const titulo =
    lines.find((line) => looksLikeTitle(line) && !looksLikeCondition(line)) ||
    lines[0] ||
    "";

  const excluded = new Set(
    [titulo, enlace, minimumLine, savingLine].filter(Boolean)
  );

  const codigo =
    lines.find((line) => {
      if (excluded.has(line)) return false;
      if (looksLikeCondition(line) || looksLikeUrl(line)) return false;
      if (line.length < 3 || line.length > 40) return false;

      return /^[A-ZÁÉÍÓÚÑ0-9_-]+$/i.test(line.replace(/\s+/g, ""));
    }) || "";

  return {
    titulo,
    codigo: codigo.replace(/\s+/g, ""),
    compra_minima: minimumLine ? extractMoney(minimumLine) : "",
    ahorro_maximo: savingLine ? extractMoney(savingLine) : "",
    enlace,
    activo: true,
    categoria: "tienda",
    valid: Boolean(titulo && codigo && enlace),
    result: "",
  };
}

function parseImportText(text) {
  return text
    .trim()
    .split(/\n\s*\n+/)
    .map(parseBlock)
    .filter((coupon) =>
      coupon.titulo ||
      coupon.codigo ||
      coupon.compra_minima ||
      coupon.ahorro_maximo ||
      coupon.enlace
    );
}

function renderImportPreview() {
  importList.replaceChildren();

  for (const [index, coupon] of detectedCoupons.entries()) {
    const row = document.createElement("tr");

    const resultText = coupon.result
      ? coupon.result
      : coupon.valid
        ? "Listo"
        : "Revisar datos";

    const resultClass =
      coupon.result === "Publicado" || (coupon.valid && !coupon.result)
        ? "resultado-ok"
        : "resultado-error";

    row.innerHTML = `
      <td>${escapeHtml(coupon.titulo)}</td>
      <td>${escapeHtml(coupon.codigo)}</td>
      <td>${escapeHtml(coupon.compra_minima)}</td>
      <td>${escapeHtml(coupon.ahorro_maximo)}</td>
      <td>${escapeHtml(coupon.enlace)}</td>
      <td class="${resultClass}">${escapeHtml(resultText)}</td>
    `;

    row.addEventListener("dblclick", () => {
      titleInput.value = coupon.titulo;
      codeInput.value = coupon.codigo;
      minimumInput.value = coupon.compra_minima;
      savingInput.value = coupon.ahorro_maximo;
      linkInput.value = coupon.enlace;
      activeInput.checked = true;
  categoryInput.value = "tienda";

      importerPanel.hidden = true;
      formTitle.textContent = "Revisar cupón importado";
      cancelEditButton.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    importList.appendChild(row);
  }

  importPreview.hidden = detectedCoupons.length === 0;
}

function processImport() {
  const text = importText.value.trim();

  if (!text) {
    setMessage(importMessage, "Pega primero el texto de los cupones.", true);
    importPreview.hidden = true;
    return;
  }

  detectedCoupons = parseImportText(text);
  renderImportPreview();

  const validCount = detectedCoupons.filter((coupon) => coupon.valid).length;
  const invalidCount = detectedCoupons.length - validCount;

  if (!detectedCoupons.length) {
    setMessage(importMessage, "No se detectaron cupones.", true);
    return;
  }

  setMessage(
    importMessage,
    `${validCount} cupones listos y ${invalidCount} que requieren revisión.`,
    invalidCount > 0
  );
}

async function saveImportedCoupons() {
  const validCoupons = detectedCoupons.filter(
    (coupon) => coupon.valid && coupon.result !== "Publicado"
  );

  if (!validCoupons.length) {
    setMessage(
      importMessage,
      "No hay cupones válidos pendientes de publicar.",
      true
    );
    return;
  }

  saveImportButton.disabled = true;
  setMessage(importMessage, "Publicando cupones...");

  let successCount = 0;
  let errorCount = 0;

  for (const coupon of validCoupons) {
    try {
      await adminRequest("/api/admin-cupones", {
        method: "POST",
        body: JSON.stringify({
          titulo: coupon.titulo,
          codigo: coupon.codigo,
          compra_minima: coupon.compra_minima,
          ahorro_maximo: coupon.ahorro_maximo,
          enlace: coupon.enlace,
          activo: true,
          categoria: coupon.categoria || "tienda",
        }),
      });

      coupon.result = "Publicado";
      successCount += 1;
    } catch (error) {
      coupon.result = "Error";
      errorCount += 1;
    }

    renderImportPreview();
  }

  setMessage(
    importMessage,
    `${successCount} publicados correctamente y ${errorCount} con error.`,
    errorCount > 0
  );

  await loadCoupons();
  saveImportButton.disabled = false;
}

function clearImport() {
  importText.value = "";
  detectedCoupons = [];
  importList.replaceChildren();
  importPreview.hidden = true;
  setMessage(importMessage);
}

function toggleImporter(show) {
  importerPanel.hidden = !show;

  if (show) {
    importText.focus();
    importerPanel.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

loginButton.addEventListener("click", login);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

logoutButton.addEventListener("click", logout);
couponForm.addEventListener("submit", saveCoupon);
couponList.addEventListener("click", handleTableAction);
refreshButton.addEventListener("click", loadCoupons);
newCouponButton.addEventListener("click", resetForm);
cancelEditButton.addEventListener("click", resetForm);

showImporterButton.addEventListener("click", () => toggleImporter(true));
closeImporterButton.addEventListener("click", () => toggleImporter(false));
processImportButton.addEventListener("click", processImport);
clearImportButton.addEventListener("click", clearImport);
saveImportButton.addEventListener("click", saveImportedCoupons);

if (adminPassword) {
  login();
}
