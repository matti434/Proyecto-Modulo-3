import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

export const carritoApi = {
    obtener: async () => {
        return await apiGet('/carrito');
    },

    agregarItem: async (productoId, cantidad = 1) => {
        return await apiPost('/carrito', { productoId, cantidad });
    },

    actualizarCantidad: async (itemId, cantidad) => {
        return await apiPut(`/carrito/${itemId}`, { cantidad });
    },

    eliminarItem: async (itemId) => {
        return await apiDelete(`/carrito/${itemId}`);
    },

    vaciar: async () => {
        return await apiDelete('/carrito');
    }
};