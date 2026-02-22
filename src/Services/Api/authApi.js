import { apiPost, apiGet, apiPut } from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authApi = {
  login: async (credencial, contrasena) => {
    return await apiPost('/auth/login', { credencial, contrasena });
  },

  registro: async (datos) => {
    const { contrasena, confirmarContrasena, ...resto } = datos;
    const body = { ...resto, password: contrasena };
    return await apiPost('/auth/registro', body);
  },

  obtenerPerfil: async () => {
    return await apiGet('/auth/perfil');
  },

  actualizarPerfil: async (datos) => {
    return await apiPut('/auth/perfil', datos);
  },

  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },
};