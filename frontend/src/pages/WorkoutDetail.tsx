import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import {
    getEntrenamientoById,
    getEjercicios,
    createRegistro,
    deleteRegistro
} from '../services/api';
import type { Entrenamiento, Ejercicio, RegistroEjercicio } from '../types';

const WorkoutDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<Entrenamiento | null>(null);
    const [exercises, setExercises] = useState<Ejercicio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRegistro, setNewRegistro] = useState<Partial<RegistroEjercicio>>({
        series: 3,
        repeticiones: 10,
        peso: 0,
        descanso: 60
    });

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const [workoutData, exercisesData] = await Promise.all([
                getEntrenamientoById(Number(id)),
                getEjercicios()
            ]);
            setWorkout(workoutData);
            setExercises(exercisesData);
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
                repeticiones: 10,
                peso: 0,
                descanso: 60
            });
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    const handleDeleteRegistro = async (registroId: number) => {
        if (window.confirm('Remove this exercise from workout?')) {
            try {
                await deleteRegistro(registroId);
                await fetchData();
            } catch (error) {
                console.error('Error deleting registro:', error);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!workout) return <div>Workout not found</div>;

    return (
        <Layout>
            <div style={{ marginBottom: '2rem' }}>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/entrenamientos')}
                    style={{ marginBottom: '1rem', paddingLeft: 0 }}
                    icon={<ArrowLeft size={20} />}
                >
                    Back to Workouts
                </Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            {new Date(workout.fecha).toLocaleDateString()}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                            {workout.lugar}
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
                        Add Exercise
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {workout.registros.map((registro) => (
                    <Card key={registro.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    {registro.ejercicio_nombre}
                                </h3>
                                <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem' }}>Sets</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{registro.series}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem' }}>Reps</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{registro.repeticiones}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.875rem' }}>Weight</span>
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
                    </Card>
                ))}

                {workout.registros.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: 'var(--text-secondary)',
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <p>No exercises added yet.</p>
                        <Button variant="ghost" onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>
                            Add your first exercise
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Exercise to Workout"
            >
                <form onSubmit={handleAddExercise}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Exercise
                        </label>
                        <select
                            value={newRegistro.ejercicio || ''}
                            onChange={(e) => setNewRegistro({ ...newRegistro, ejercicio: Number(e.target.value) })}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--surface)',
                                color: 'var(--text)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        >
                            <option value="">Select an exercise...</option>
                            {exercises.map(ex => (
                                <option key={ex.id} value={ex.id}>{ex.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            type="number"
                            label="Sets"
                            value={newRegistro.series}
                            onChange={(e) => setNewRegistro({ ...newRegistro, series: Number(e.target.value) })}
                            required
                            min="1"
                        />
                        <Input
                            type="number"
                            label="Reps"
                            value={newRegistro.repeticiones}
                            onChange={(e) => setNewRegistro({ ...newRegistro, repeticiones: Number(e.target.value) })}
                            required
                            min="1"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            type="number"
                            label="Weight (kg)"
                            value={newRegistro.peso}
                            onChange={(e) => setNewRegistro({ ...newRegistro, peso: Number(e.target.value) })}
                            required
                            min="0"
                            step="0.5"
                        />
                        <Input
                            type="number"
                            label="Rest (sec)"
                            value={newRegistro.descanso}
                            onChange={(e) => setNewRegistro({ ...newRegistro, descanso: Number(e.target.value) })}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Exercise
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default WorkoutDetail;
