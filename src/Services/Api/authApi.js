import { apiPost, apiGet, apiPut } from './apiClient';

export const authApi = {
  login: async (credencial, contrasena) => {
    const resultado = await apiPost('/auth/login', { credencial, contrasena });
    if (resultado.token) {
      localStorage.setItem('token', resultado.token);
    }
    return resultado;
  },

  registro: async (datos) => {
    const resultado = await apiPost('/auth/registro', datos);
    if (resultado.token) {
      localStorage.setItem('token', resultado.token);
    }
    return resultado;
  },

  obtenerPerfil: async () => {
    return await apiGet('/auth/perfil');
  },

  actualizarPerfil: async (datos) => {
    return await apiPut('/auth/perfil', datos);
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  tieneToken: () => {
    return !!localStorage.getItem('token');
  }
};