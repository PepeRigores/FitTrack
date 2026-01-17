import React, { useEffect, useState } from 'react';
import { Plus, Calendar, MapPin, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { getEntrenamientos, createEntrenamiento, deleteEntrenamiento } from '../services/api';
import type { Entrenamiento } from '../types';

const Workouts: React.FC = () => {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState<Entrenamiento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState<Partial<Entrenamiento>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const data = await getEntrenamientos();
            setWorkouts(data);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await createEntrenamiento(currentWorkout);
            await fetchWorkouts();
            setIsModalOpen(false);
            setCurrentWorkout({});
        } catch (error) {
            console.error('Error saving workout:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este entrenamiento?')) {
            try {
                await deleteEntrenamiento(id);
                setWorkouts(workouts.filter(w => w.id !== id));
            } catch (error) {
                console.error('Error deleting workout:', error);
            }
        }
    };

    const openModal = () => {
        setCurrentWorkout({
            fecha: new Date().toISOString().split('T')[0],
            lugar: 'Gimnasio',
            notas: ''
        });
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Entrenamientos</h1>
                <Button onClick={openModal} icon={<Plus size={20} />}>
                    Nuevo Entrenamiento
                </Button>
            </div>

            {isLoading ? (
                <div>Cargando...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {workouts.map((workout) => (
                        <div
                            key={workout.id}
                            onClick={() => navigate(`/entrenamientos/${workout.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card className="hover:border-[var(--primary)] transition-colors">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <Calendar size={16} />
                                            <span>{new Date(workout.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                            <MapPin size={16} color="var(--primary)" />
                                            <span>{workout.lugar}</span>
                                        </div>
                                        {workout.notas && (
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                {workout.notas}
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => handleDelete(e, workout.id)}
                                            style={{ color: 'var(--danger)' }}
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                        <ChevronRight size={24} color="var(--text-secondary)" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nuevo Entrenamiento"
            >
                <form onSubmit={handleSave}>
                    <Input
                        type="datetime-local"
                        label="Fecha y Hora"
                        value={currentWorkout.fecha ? currentWorkout.fecha.slice(0, 16) : ''}
                        onChange={(e) => setCurrentWorkout({ ...currentWorkout, fecha: e.target.value })}
                        required
                    />

                    <Input
                        label="Lugar"
                        value={currentWorkout.lugar || ''}
                        onChange={(e) => setCurrentWorkout({ ...currentWorkout, lugar: e.target.value })}
                        placeholder="ej. Gimnasio, Casa, Parque"
                        required
                    />

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Notas
                        </label>
                        <textarea
                            value={currentWorkout.notas || ''}
                            onChange={(e) => setCurrentWorkout({ ...currentWorkout, notas: e.target.value })}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--surface)',
                                color: 'var(--text)',
                                fontSize: '1rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" isLoading={isSaving}>
                            Crear Entrenamiento
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Workouts;
