const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchApi = async (endpoint, options = {}) => {
    const config = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const err = new Error(data.mensaje || (response.status === 401 ? 'No autenticado' : 'Error en la peticion'));
            err.status = response.status;
            throw err;
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('No se puede conectar al servidor. Verifica que el backend este corriendo.');
        }
        throw error;
    }
};

export const apiGet = (endpoint) => fetchApi(endpoint, { method: 'GET' });
export const apiPost = (endpoint, body) => fetchApi(endpoint, {method: 'POST', body });
export const apiPut = (endpoint, body) => fetchApi(endpoint, { method: 'PUT', body });
export const apiDelete = (endpoint) => fetchApi(endpoint, { method: 'DELETE' });