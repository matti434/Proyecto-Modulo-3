import { apiPost } from './apiClient';

export const contactoApi = {
  enviarMensaje: async (datos) => {
    return await apiPost('/contacto', datos);
  },
};