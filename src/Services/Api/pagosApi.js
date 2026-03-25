import { apiPost, apiGet } from './apiClient';

export const pagosApi = {
  crearPreferencia: async (datos) => {
    return await apiPost('/pagos/crear-preferencia', datos);
  },

  verificarPago: async (transaccionId) => {
    return await apiGet(`/pagos/verificar/${transaccionId}`);
  },
};
