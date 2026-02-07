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
