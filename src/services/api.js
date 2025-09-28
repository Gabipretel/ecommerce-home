import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autorización automáticamente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y renovar tokens automáticamente
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (no autorizado) y no hemos intentado renovar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post('http://localhost:3000/api/auth/refresh', {
                        refreshToken
                    });

                    if (response.data.success) {
                        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                        
                        // Actualizar tokens en localStorage
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);

                        // Reintentar la request original con el nuevo token
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Error renovando token:', refreshError);
                // Si falla la renovación, limpiar tokens y redirigir al login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userType');
                
                // Redirigir al login si estamos en el navegador
                if (typeof window !== 'undefined') {
                    window.location.href = '/login-user';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
