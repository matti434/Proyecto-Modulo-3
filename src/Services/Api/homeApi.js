
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

export const actualizarIntegranteEquipo = async (id, datos) => {
const response = await fetch(`${API_URL}/home/equipo/${id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
... getAuthHeaders(),
},
body: JSON.stringify(datos),
});
const data = await response.json().catch(() => ({}));
if (!response.ok) {
throw new Error(data.mensaje || "Error al actualizar integrante");
}
return data;
};
export const subirImagenEquipo = async (id, file) => {
const formData = new FormData();
formData.append("imagen", file);
const response = await fetch(`${API_URL}/home/equipo/${id}/imagen`, {
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
"Error al subir la imagen"
);
}
return data;
};

export const eliminarIntegranteEquipo = async (id) => {
  const response = await fetch(`${API_URL}/home/equipo/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || "Error al eliminar integrante");
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
  actualizarIntegranteEquipo,
  subirImagenEquipo,
  eliminarIntegranteEquipo,
};
