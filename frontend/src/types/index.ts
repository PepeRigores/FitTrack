export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Ejercicio {
    id: number;
    nombre: string;
    categoria: string;
    tipo: string;
    unidad: 'reps' | 'minutos' | 'km';
    imagen?: string;
    video?: string;
}

export interface RegistroEjercicio {
    id: number;
    entrenamiento: number;
    ejercicio: number;
    ejercicio_nombre?: string;
    ejercicio_imagen?: string;
    ejercicio_unidad?: 'reps' | 'minutos' | 'km';
    series: number;
    cantidad: number;
    peso: number;
    descanso?: number;
}

export interface Entrenamiento {
    id: number;
    usuario: string;
    fecha: string;
    lugar: string;
    notas?: string;
    registros: RegistroEjercicio[];
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

export interface UserTokenPayload {
    user_id: number;
    username?: string;
    email?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}

export interface Estadisticas {
    total_entrenamientos: number;
    total_ejercicios_registrados: number;
    entrenamientos_chart: { fecha__date: string; count: number }[];
    ejercicios_frecuentes: { ejercicio__nombre: string; count: number }[];
}
