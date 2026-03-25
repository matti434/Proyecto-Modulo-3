import { apiPost, apiGet } from './apiClient';

export const pagosApi = {
  crearPreferencia: async (datos) => {
    return await apiPost('/pagos/crear-preferencia', datos);
  },

  /**
   * GET /pagos/verificar/:transaccionId?payment_id=...
   * transaccionId: external_reference del pedido; payment_id: id de pago de Mercado Pago.
   */
  verificarPago: async (transaccionId, options = {}) => {
    const id = encodeURIComponent(String(transaccionId));
    const params = new URLSearchParams();
    if (options.paymentId != null && options.paymentId !== '') {
      params.set('payment_id', String(options.paymentId));
    }
    const query = params.toString();
    return await apiGet(`/pagos/verificar/${id}${query ? `?${query}` : ''}`);
  },

  /** Idempotente en backend si ya se procesó el mismo payment_id */
  confirmarPago: async (payload) => {
    return await apiPost('/pagos/confirmar', payload);
  },
};
