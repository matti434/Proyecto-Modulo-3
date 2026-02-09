import { apiGet, apiPost, apiPut, apiDelete } from './apiService';

export const usuarioApi = {
    
    obtenerTodos: async () => (
      return await apiGet('/usuarios');
    ),

    obtenerPorId: async (id) => (
        return await apiGet(`/usuarios/${id}`);
    ),

    actualizar: async (id,datos) => (
        return await apiPut('/usuarios/${id', datos)
    ),

    eliminar: async (id) => (
        return await apiDelete('/usuarios/${id');
    ),

    suspender: async (id) => (
        return await apiPost('/usuarios/${id}/suspender');
    ),

    reactivar: async (id) => (
        return await apiPost('/usuarios/${id}/reactivar');
    ),

    buscar: async (id) => (
        return await apiGet('/usuarios/buscar?termino=${termino}');
    ),

    obtenerSuspendidos: async () => (
        return await apiGet('/usuarios/suspendidos');
    ),

};