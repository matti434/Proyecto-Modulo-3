import { apiPost, apiGet } from './apiClient';

export const pagosApi = {
  crearTransaccion: async (datosCarrito) => {
    return await apiPost('/pagos/crear', datosCarrito);
  },

  verificarEstado: async (transaccionId) => {
    return await apiGet(`/pagos/verificar/${transaccionId}`);
  },
};