import { apiGet, apiPost, apiPut} from './apiClient';

export const pedidosApi = {
    obtener: async () => {
        return await apiGet('/pedidos');
    },

    obtenerTodos: async () => {
        return await apiGet('/pedidos?todos=true');
    },

    obtenerPorId: async (id) => {
        return await apiGet(`/pedidos/${id}`);
    },

    crear: async (datos) => {
        return await apiPost ('/pedidos',datos);
    },

    actualizarEstado: async (id , estado) =>{
        return await apiPut(`/pedidos/${id}/estado`, {estado});
    }
}