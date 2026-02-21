import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.categoria != null) searchParams.set('categoria', params.categoria);
  if (params.marca != null) searchParams.set('marca', params.marca);
  if (params.destacado != null) searchParams.set('destacado', String(params.destacado));
  if (params.stock != null) searchParams.set('stock', String(params.stock));
  if (params.buscar != null) searchParams.set('buscar', params.buscar);
  if (params.reciente != null) searchParams.set('reciente', String(params.reciente));
  if (params.limite != null) searchParams.set('limite', String(params.limite));
  if (params.precioMin != null) searchParams.set('precioMin', String(params.precioMin));
  if (params.precioMax != null) searchParams.set('precioMax', String(params.precioMax));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

export const subirImagenProducto = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('imagen', file);

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/productos/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const mensaje =
      data.mensaje ||
      (response.status === 413 ? 'Archivo demasiado grande' : null) ||
      (response.status === 401 ? 'Debes iniciar sesión' : null) ||
      (response.status === 400 ? 'Formato de imagen no válido' : null) ||
      'Error al subir la imagen';
    throw new Error(mensaje);
  }
  return data;
};

export const productosApi = {

  subirImagen: subirImagenProducto,


  obtenerTodos: async (params) => {
    const query = buildQuery(params);
    return await apiGet(`/productos${query}`);
  },

  obtenerPorId: async (id) => {
    return await apiGet(`/productos/${id}`);
  },

  crear: async (datos) => {
    return await apiPost('/productos', datos);
  },

  actualizar: async (id, datos) => {
    return await apiPut(`/productos/${id}`, datos);
  },

  eliminar: async (id) => {
    return await apiDelete(`/productos/${id}`);
  },
};