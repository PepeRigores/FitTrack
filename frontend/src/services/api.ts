import axios from 'axios';

const API_URL = 'https://fitness-tracker-p7dp.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}auth/refresh/`, {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('token', response.data.access);
                    api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Types
import type { Ejercicio, Entrenamiento, RegistroEjercicio } from '../types';

// Exercises
export const getEjercicios = async () => {
    const response = await api.get<Ejercicio[]>('ejercicios/');
    return response.data;
};

export const createEjercicio = async (data: Omit<Ejercicio, 'id'>) => {
    const response = await api.post<Ejercicio>('ejercicios/', data);
    return response.data;
};

export const updateEjercicio = async (id: number, data: Partial<Ejercicio>) => {
    const response = await api.patch<Ejercicio>(`ejercicios/${id}/`, data);
    return response.data;
};

export const deleteEjercicio = async (id: number) => {
    await api.delete(`ejercicios/${id}/`);
};

// Workouts
export const getEntrenamientos = async () => {
    const response = await api.get<Entrenamiento[]>('entrenamientos/');
    return response.data;
};

export const getEntrenamientoById = async (id: number) => {
    const response = await api.get<Entrenamiento>(`entrenamientos/${id}/`);
    return response.data;
};

export const createEntrenamiento = async (data: Partial<Entrenamiento>) => {
    const response = await api.post<Entrenamiento>('entrenamientos/', data);
    return response.data;
};

export const updateEntrenamiento = async (id: number, data: Partial<Entrenamiento>) => {
    const response = await api.patch<Entrenamiento>(`entrenamientos/${id}/`, data);
    return response.data;
};

export const deleteEntrenamiento = async (id: number) => {
    await api.delete(`entrenamientos/${id}/`);
};

// Registros (Exercises in Workout)
export const getRegistros = async () => {
    const response = await api.get<RegistroEjercicio[]>('registros/');
    return response.data;
};

export const createRegistro = async (data: Partial<RegistroEjercicio>) => {
    const response = await api.post<RegistroEjercicio>('registros/', data);
    return response.data;
};

export const updateRegistro = async (id: number, data: Partial<RegistroEjercicio>) => {
    const response = await api.patch<RegistroEjercicio>(`registros/${id}/`, data);
    return response.data;
};

export const deleteRegistro = async (id: number) => {
    await api.delete(`registros/${id}/`);
};

// Stats
export const getEstadisticas = async () => {
    const response = await api.get('estadisticas/');
    return response.data;
};
