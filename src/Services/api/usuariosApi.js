import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const usuariosApi = {
    
    obtenerTodos: async (soloActivos = false) => {
      const query = soloActivos ? '?suspendidos=false' : '';
      return await apiGet(`/usuarios${query}`);
    },

    obtenerPorId: async (id) => {
        return await apiGet(`/usuarios/${id}`);
    },

    actualizar: async (id,datos) => {
        return await apiPut(`/usuarios/${id}`, datos)
    },

    eliminar: async (id) => {
        return await apiDelete(`/usuarios/${id}`);
    },

    suspender: async (id) => {
        return await apiPost(`/usuarios/${id}/suspender`);
    },

    reactivar: async (id) => {
        return await apiPost(`/usuarios/${id}/reactivar`);
    },

    buscar: async (termino) => {
        return await apiGet(`/usuarios?buscar=${encodeURIComponent(termino)}`);
    },

    obtenerSuspendidos: async () => {
        return await apiGet('/usuarios?suspendidos=true');
    },

};