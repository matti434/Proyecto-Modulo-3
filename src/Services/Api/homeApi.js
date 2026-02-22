const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Obtiene el contenido de la home (galería + portada) desde el backend.
 */
export const obtenerContenidoHome = async () => {
  const response = await fetch(`${API_URL}/home`, {
    method: "GET",
    headers: { ...getAuthHeaders() },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || "Error al cargar la home");
  }
  return data;
};

/**
 * Sube la imagen de portada. El backend sube a Cloudinary y guarda la URL.
 */
export const subirPortada = async (file) => {
  const formData = new FormData();
  formData.append("imagen", file);
  const response = await fetch(`${API_URL}/home/portada/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.mensaje ||
        (response.status === 413 ? "Archivo demasiado grande" : null) ||
        (response.status === 400 ? "Formato de imagen no válido" : null) ||
        "Error al subir la imagen de portada"
    );
  }
  return data;
};

/**
 * Añade una imagen a la galería (backend sube a Cloudinary y crea el ítem).
 */
export const agregarImagenGaleria = async (file, texto) => {
  const formData = new FormData();
  formData.append("imagen", file);
  formData.append("texto", texto || "");
  const response = await fetch(`${API_URL}/home/galeria`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.mensaje ||
        (response.status === 413 ? "Archivo demasiado grande" : null) ||
        (response.status === 400 ? "Formato de imagen no válido" : null) ||
        "Error al agregar imagen a la galería"
    );
  }
  return data;
};

/**
 * Actualiza solo el texto de un ítem de la galería.
 */
export const actualizarTextoGaleria = async (id, texto) => {
  const response = await fetch(`${API_URL}/home/galeria/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ texto: texto || "" }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || "Error al actualizar el texto");
  }
  return data;
};

/**
 * Reemplaza la imagen de un ítem de la galería (backend sube a Cloudinary).
 */
export const reemplazarImagenGaleria = async (id, file) => {
  const formData = new FormData();
  formData.append("imagen", file);
  const response = await fetch(`${API_URL}/home/galeria/${id}/imagen`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.mensaje ||
        (response.status === 400 ? "Formato de imagen no válido" : null) ||
        "Error al reemplazar la imagen"
    );
  }
  return data;
};

/**
 * Elimina un ítem de la galería.
 */
export const eliminarImagenGaleria = async (id) => {
  const response = await fetch(`${API_URL}/home/galeria/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || "Error al eliminar");
  }
  return data;
};

export const homeApi = {
  obtenerContenidoHome,
  subirPortada,
  agregarImagenGaleria,
  actualizarTextoGaleria,
  reemplazarImagenGaleria,
  eliminarImagenGaleria,
};
