function authorized(request) {
  return Boolean(process.env.ADMIN_PASSWORD) &&
    String(request.headers["x-admin-password"] || "") ===
      process.env.ADMIN_PASSWORD;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Método no permitido." });
  }

  if (!authorized(request)) {
    return response.status(401).json({
      error: "Contraseña de administrador incorrecta.",
    });
  }

  const dataUrl = String(request.body?.data_url || "");
  const originalName = String(request.body?.nombre || "publicidad.webp");

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return response.status(400).json({
      error: "La imagen no es válida.",
    });
  }

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length > 3 * 1024 * 1024) {
    return response.status(400).json({
      error: "La imagen supera 3 MB.",
    });
  }

  const url = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");

  const key = process.env.SUPABASE_SECRET_KEY;

  const extension =
    mimeType.includes("webp") ? "webp" :
    mimeType.includes("png") ? "png" :
    "jpg";

  const safeName = originalName
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "publicidad";

  const fileName =
    `${Date.now()}-${safeName}.${extension}`;

  try {
    const upload = await fetch(
      `${url}/storage/v1/object/publicidad/${fileName}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": mimeType,
          "x-upsert": "false",
        },
        body: buffer,
      }
    );

    if (!upload.ok) {
      const detail = await upload.text();

      return response.status(502).json({
        error: "No fue posible subir la imagen.",
        detalle: detail,
      });
    }

    return response.status(200).json({
      imagen_url:
        `${url}/storage/v1/object/public/publicidad/${fileName}`,
    });
  } catch (error) {
    return response.status(500).json({
      error: "Error interno al subir la imagen.",
    });
  }
}
