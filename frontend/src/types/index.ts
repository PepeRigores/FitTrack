export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Ejercicio {
    id: number;
    nombre: string;
    categoria: string;
    descripcion?: string;
    tipo: string;
    unidad: string;
    imagen?: string;
    video?: string;
}

export interface RegistroEjercicio {
    id: number;
    entrenamiento: number;
    ejercicio: number;
    ejercicio_nombre?: string;
    ejercicio_imagen?: string;
    series: number;
    repeticiones: number;
    peso: number;
    duracion?: number;
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
