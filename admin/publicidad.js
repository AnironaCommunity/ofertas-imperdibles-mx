const loginPanel = document.querySelector("#login-panel");
const adminPanel = document.querySelector("#admin-panel");
const passwordInput = document.querySelector("#admin-password");
const loginButton = document.querySelector("#login-button");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#cerrar-sesion");

const form = document.querySelector("#publicidad-form");
const idInput = document.querySelector("#publicidad-id");
const titleInput = document.querySelector("#titulo");
const descriptionInput = document.querySelector("#descripcion");
const linkInput = document.querySelector("#enlace");
const orderInput = document.querySelector("#orden");
const activeInput = document.querySelector("#activo");
const fileInput = document.querySelector("#imagen");
const imageUrlInput = document.querySelector("#imagen-url");
const previewWrapper = document.querySelector("#preview-wrapper");
const previewImage = document.querySelector("#imagen-preview");
const formTitle = document.querySelector("#form-title");
const formMessage = document.querySelector("#form-message");
const cancelButton = document.querySelector("#cancelar-edicion");
const newButton = document.querySelector("#nueva-publicidad");

const list = document.querySelector("#publicidades-lista");
const listMessage = document.querySelector("#list-message");
const refreshButton = document.querySelector("#actualizar-lista");

let adminPassword = sessionStorage.getItem("adminPassword") || "";
let publicidades = [];

function message(element, text = "", error = false) {
  element.textContent = text;
  element.classList.toggle("error", error);
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
    message(loginMessage, "Ingresa la contraseña.", true);
    return;
  }

  loginButton.disabled = true;

  try {
    adminPassword = password;
    await api("/api/admin-publicidad");

    sessionStorage.setItem("adminPassword", password);
    loginPanel.hidden = true;
    adminPanel.hidden = false;

    await cargarLista();
  } catch (error) {
    adminPassword = "";
    sessionStorage.removeItem("adminPassword");
    message(loginMessage, error.message, true);
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

function resetForm() {
  form.reset();
  idInput.value = "";
  imageUrlInput.value = "";
  activeInput.checked = true;
  orderInput.value = "0";
  previewWrapper.hidden = true;
  previewImage.src = "";
  formTitle.textContent = "Agregar publicidad";
  cancelButton.hidden = true;
  message(formMessage);
}

function edit(publicidad) {
  idInput.value = publicidad.id;
  titleInput.value = publicidad.titulo || "";
  descriptionInput.value = publicidad.descripcion || "";
  linkInput.value = publicidad.enlace || "";
  orderInput.value = publicidad.orden || 0;
  activeInput.checked = Boolean(publicidad.activo);
  imageUrlInput.value = publicidad.imagen_url || "";

  previewImage.src = publicidad.imagen_url;
  previewWrapper.hidden = false;

  formTitle.textContent = `Editar: ${publicidad.titulo}`;
  cancelButton.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function render() {
  list.replaceChildren();

  if (!publicidades.length) {
    list.innerHTML = "<p>No hay publicidades registradas.</p>";
    return;
  }

  for (const publicidad of publicidades) {
    const item = document.createElement("article");

    item.className = "publicidad-item";

    item.innerHTML = `
      <img src="${escapeHtml(publicidad.imagen_url)}" alt="" />

      <div class="publicidad-info">
        <h3>${escapeHtml(publicidad.titulo)}</h3>
        <p>${escapeHtml(publicidad.descripcion || "")}</p>
        <small>
          Orden: ${Number(publicidad.orden || 0)} ·
          Clics: ${Number(publicidad.clics || 0)} ·
          ${publicidad.activo ? "Activa" : "Inactiva"}
        </small>
      </div>

      <div class="publicidad-acciones">
        <button class="editar" data-action="edit" data-id="${publicidad.id}">
          Editar
        </button>

        <button class="estado" data-action="toggle" data-id="${publicidad.id}">
          ${publicidad.activo ? "Desactivar" : "Activar"}
        </button>

        <button class="eliminar" data-action="delete" data-id="${publicidad.id}">
          Eliminar
        </button>
      </div>
    `;

    list.appendChild(item);
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

async function cargarLista() {
  refreshButton.disabled = true;
  message(listMessage, "Cargando...");

  try {
    publicidades = await api("/api/admin-publicidad");
    render();
    message(listMessage, `${publicidades.length} publicidades registradas.`);
  } catch (error) {
    message(listMessage, error.message, true);
  } finally {
    refreshButton.disabled = false;
  }
}

async function optimizarImagen(file) {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1200;
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height)
  );

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL("image/webp", 0.82);
}

async function subirImagen() {
  const file = fileInput.files[0];

  if (!file) {
    return imageUrlInput.value;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona una imagen válida.");
  }

  const dataUrl = await optimizarImagen(file);

  const result = await api("/api/admin-publicidad-imagen", {
    method: "POST",
    body: JSON.stringify({
      data_url: dataUrl,
      nombre: file.name,
    }),
  });

  return result.imagen_url;
}

async function save(event) {
  event.preventDefault();

  const submit = form.querySelector('button[type="submit"]');

  submit.disabled = true;
  message(formMessage, "Guardando publicidad...");

  try {
    const imageUrl = await subirImagen();

    if (!imageUrl) {
      throw new Error("Selecciona una foto del producto.");
    }

    const payload = {
      titulo: titleInput.value.trim(),
      descripcion: descriptionInput.value.trim(),
      enlace: linkInput.value.trim(),
      imagen_url: imageUrl,
      orden: Number(orderInput.value) || 0,
      activo: activeInput.checked,
    };

    const id = Number(idInput.value);

    if (id) {
      await api("/api/admin-publicidad", {
        method: "PUT",
        body: JSON.stringify({
          id,
          ...payload,
        }),
      });

      message(formMessage, "Publicidad actualizada.");
    } else {
      await api("/api/admin-publicidad", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      message(formMessage, "Publicidad agregada.");
    }

    resetForm();
    await cargarLista();
  } catch (error) {
    message(formMessage, error.message, true);
  } finally {
    submit.disabled = false;
  }
}

async function handleList(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const publicidad = publicidades.find((item) => Number(item.id) === id);

  if (!publicidad) return;

  if (button.dataset.action === "edit") {
    edit(publicidad);
    return;
  }

  if (button.dataset.action === "toggle") {
    await api("/api/admin-publicidad", {
      method: "PUT",
      body: JSON.stringify({
        id,
        activo: !publicidad.activo,
      }),
    });

    await cargarLista();
    return;
  }

  if (button.dataset.action === "delete") {
    const confirmed = confirm(
      `¿Seguro que deseas eliminar "${publicidad.titulo}"?`
    );

    if (!confirmed) return;

    await api(`/api/admin-publicidad?id=${id}`, {
      method: "DELETE",
    });

    await cargarLista();
  }
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];

  if (!file) return;

  const dataUrl = await optimizarImagen(file);

  previewImage.src = dataUrl;
  previewWrapper.hidden = false;
});

loginButton.addEventListener("click", login);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

logoutButton.addEventListener("click", logout);
form.addEventListener("submit", save);
list.addEventListener("click", handleList);
refreshButton.addEventListener("click", cargarLista);
newButton.addEventListener("click", resetForm);
cancelButton.addEventListener("click", resetForm);

if (adminPassword) {
  login();
}
