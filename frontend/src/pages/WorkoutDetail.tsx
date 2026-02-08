import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import {
    getEntrenamientoById,
    getEjercicioById,
    createRegistro,
    deleteRegistro
} from '../services/api';
import type { Entrenamiento, Ejercicio, RegistroEjercicio } from '../types';

const WorkoutDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [workout, setWorkout] = useState<Entrenamiento | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<Ejercicio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRegistro, setNewRegistro] = useState<Partial<RegistroEjercicio>>({
        series: 3,
        cantidad: 10,
        peso: 0,
        descanso: 60
    });

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        const newExerciseId = searchParams.get('newExerciseId');
        if (newExerciseId) {
            fetchExerciseDetails(Number(newExerciseId));
        }
    }, [searchParams]);

    const fetchExerciseDetails = async (exerciseId: number) => {
        try {
            const exercise = await getEjercicioById(exerciseId);
            setSelectedExercise(exercise);
            const defaultSeries = (exercise.unidad === 'minutos' || exercise.unidad === 'km') ? 1 : 3;
            setNewRegistro(prev => ({ ...prev, ejercicio: exercise.id, series: defaultSeries }));
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching exercise details:', error);
        }
    };

    const fetchData = async () => {
        try {
            const workoutData = await getEntrenamientoById(Number(id));
            setWorkout(workoutData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workout || !newRegistro.ejercicio) return;

        try {
            await createRegistro({
                ...newRegistro,
                entrenamiento: workout.id
            });
            await fetchData();
            setIsModalOpen(false);
            setNewRegistro({
                series: 3,
                cantidad: 10,
                peso: 0,
                descanso: 60
            });
            setSelectedExercise(null);
            // Remove param from URL
            searchParams.delete('newExerciseId');
            setSearchParams(searchParams);
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    const handleDeleteRegistro = async (registroId: number) => {
        if (window.confirm('¿Eliminar este ejercicio del entrenamiento?')) {
            try {
                await deleteRegistro(registroId);
                await fetchData();
            } catch (error) {
                console.error('Error deleting registro:', error);
            }
        }
    };

    if (isLoading) return <div>Cargando...</div>;
    if (!workout) return <div>Entrenamiento no encontrado</div>;

    return (
        <Layout>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            {new Date(workout.fecha).toLocaleDateString()}
                            <time style={{ fontSize: '1.7rem', fontWeight: 600, color: '#22c55e' }}>
                                {new Date(workout.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </time>
                        </h1>
                        <p style={{ fontSize: '1.125rem' }}>
                            {workout.lugar}
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            const existingIds = workout.registros.map(r => r.ejercicio).join(',');
                            navigate(`/ejercicios?selectMode=true&workoutId=${id}&existingExercises=${existingIds}`);
                        }}
                        icon={<Plus size={20} />}
                    >
                        Añadir Ejercicio
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {workout.registros.map((registro) => (
                    <Card key={registro.id}>
                        <div className="exercise-card-content">
                            {registro.ejercicio_imagen && (
                                <div className="exercise-image-container">
                                    <img
                                        src={`/exercises/${registro.ejercicio_imagen}`}
                                        alt={registro.ejercicio_nombre}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="exercise-info-container">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                            {registro.ejercicio_nombre}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.875rem' }}>Series</span>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{registro.series}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.875rem' }}>
                                                    {registro.ejercicio_unidad === 'minutos' ? 'Minutos' :
                                                        registro.ejercicio_unidad === 'km' ? 'Kilómetros' : 'Repeticiones'}
                                                </span>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{registro.cantidad}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.875rem' }}>Peso</span>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{registro.peso}kg</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteRegistro(registro.id)}
                                        style={{ color: 'var(--danger)' }}
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                ))}
                <div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/entrenamientos')}
                        style={{ marginBottom: '1rem', padding: '2px 10px 4px 5px', backgroundColor: 'var(--danger)', borderRadius: '6px' }}
                        icon={<ArrowLeft size={20} />}
                    >
                        <span>Volver a entrenamientos</span>
                    </Button>
                </div>

                {workout.registros.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: 'var(--text-secondary)',
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <p>No hay ejercicios añadidos aún.</p>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                const existingIds = workout.registros.map(r => r.ejercicio).join(',');
                                navigate(`/ejercicios?selectMode=true&workoutId=${id}&existingExercises=${existingIds}`);
                            }}
                            style={{ marginTop: '1rem' }}
                        >
                            Añade tu primer ejercicio
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Añadir Ejercicio al Entrenamiento"
            >
                <form onSubmit={handleAddExercise}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Ejercicio
                        </label>
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text)',
                        }}>
                            {selectedExercise ? selectedExercise.nombre : 'No exercise selected'}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            type="number"
                            label="Series"
                            value={newRegistro.series}
                            onChange={(e) => setNewRegistro({ ...newRegistro, series: Number(e.target.value) })}
                            required
                            min="1"
                        />
                        <Input
                            type="number"
                            label={selectedExercise?.unidad === 'minutos' ? 'Minutos' :
                                selectedExercise?.unidad === 'km' ? 'Kilómetros' : 'Repeticiones'}
                            value={newRegistro.cantidad}
                            onChange={(e) => setNewRegistro({ ...newRegistro, cantidad: Number(e.target.value) })}
                            required
                            min={selectedExercise?.unidad === 'km' ? "0.1" : "1"}
                            step={selectedExercise?.unidad === 'km' ? "0.1" : "1"}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            type="number"
                            label="Peso (kg)"
                            value={newRegistro.peso}
                            onChange={(e) => setNewRegistro({ ...newRegistro, peso: Number(e.target.value) })}
                            required
                            min="0"
                            step="0.5"
                        />
                        <Input
                            type="number"
                            label="Descanso (seg)"
                            value={newRegistro.descanso}
                            onChange={(e) => setNewRegistro({ ...newRegistro, descanso: Number(e.target.value) })}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Añadir Ejercicio
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default WorkoutDetail;
