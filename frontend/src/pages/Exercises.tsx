import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { getEjercicios, createEjercicio, updateEjercicio, deleteEjercicio } from '../services/api';
import type { Ejercicio } from '../types';

const Exercises: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectMode = searchParams.get('selectMode') === 'true';
    const workoutId = searchParams.get('workoutId');
    const existingExercisesParam = searchParams.get('existingExercises');
    const existingExercises = existingExercisesParam
        ? new Set(existingExercisesParam.split(',').map(Number))
        : new Set<number>();
    const [exercises, setExercises] = useState<Ejercicio[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Partial<Ejercicio>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [selectingId, setSelectingId] = useState<number | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredExercises(
            exercises.filter(ex =>
                ex.nombre.toLowerCase().includes(lowerTerm) ||
                ex.categoria.toLowerCase().includes(lowerTerm)
            )
        );
    }, [searchTerm, exercises]);

    const fetchExercises = async () => {
        try {
            const data = await getEjercicios();
            setExercises(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (currentExercise.id) {
                await updateEjercicio(currentExercise.id, currentExercise);
            } else {
                await createEjercicio(currentExercise as Omit<Ejercicio, 'id'>);
            }
            await fetchExercises();
            setIsModalOpen(false);
            setCurrentExercise({});
        } catch (error) {
            console.error('Error saving exercise:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
            try {
                await deleteEjercicio(id);
                setExercises(exercises.filter(ex => ex.id !== id));
            } catch (error) {
                console.error('Error deleting exercise:', error);
            }
        }
    };

    const openModal = (exercise?: Ejercicio) => {
        setCurrentExercise(exercise || {
            nombre: '',
            categoria: 'Pecho',
            tipo: 'Fuerza',
            unidad: 'reps',
            imagen: '',
            video: ''
        });
        setIsModalOpen(true);
    };

    const handleSelect = (exercise: Ejercicio) => {
        setSelectingId(exercise.id);
        navigate(`/entrenamientos/${workoutId}?newExerciseId=${exercise.id}`);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{selectMode ? 'Selecciona un Ejercicio' : 'Ejercicios'}</h1>
                <Button onClick={() => openModal()} icon={<Plus size={20} />}>
                    Crear ejercicio
                </Button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '500px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} size={20} />
                    <Input
                        placeholder="nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
            </div>

            {isLoading ? (
                <div>Cargando...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredExercises.map((exercise) => (
                        <Card key={exercise.id} title={exercise.nombre}>
                            {exercise.imagen && (
                                <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.03)' }}>
                                    <img
                                        src={`/exercises/${exercise.imagen}`}
                                        alt={exercise.nombre}
                                        style={{ width: '100%', height: 'auto', maxHeight: '250px', objectFit: 'contain', display: 'block' }}
                                        onError={(e) => {
                                            console.error('Error loading image:', `/exercises/${exercise.imagen}`);
                                            (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Categoría:</span>
                                    <span style={{ fontWeight: 500 }}>{exercise.categoria}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Tipo:</span>
                                    <span style={{ fontWeight: 500 }}>{exercise.tipo}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Unidad:</span>
                                    <span style={{ fontWeight: 500 }}>{exercise.unidad}</span>
                                </div>

                                {exercise.video && !exercise.imagen && (
                                    <div style={{ marginTop: '0.5rem', color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span>▶ Video disponible</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                {selectMode ? (
                                    existingExercises.has(exercise.id) ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled
                                            icon={<CheckCircle size={16} />}
                                            style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                                        >
                                            Añadido
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleSelect(exercise)}
                                            icon={<CheckCircle size={16} />}
                                            disabled={selectingId === exercise.id}
                                            style={{ width: '100%', backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}
                                        >
                                            {selectingId === exercise.id ? 'Seleccionando...' : 'Seleccionar'}
                                        </Button>
                                    )
                                ) : (
                                    <>
                                        <Button variant="secondary" size="sm" onClick={() => openModal(exercise)} icon={<Edit2 size={16} />}>
                                            Editar
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(exercise.id)} icon={<Trash2 size={16} />}>
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentExercise.id ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            >
                <form onSubmit={handleSave}>
                    <Input
                        label="Nombre"
                        value={currentExercise.nombre || ''}
                        onChange={(e) => setCurrentExercise({ ...currentExercise, nombre: e.target.value })}
                        required
                    />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Categoría
                        </label>
                        <select
                            value={currentExercise.categoria || 'Pecho'}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, categoria: e.target.value })}
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
                            {['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Cardio', 'Core', 'Otro'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Tipo
                        </label>
                        <select
                            value={currentExercise.tipo || 'Fuerza'}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, tipo: e.target.value })}
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
                            {['Fuerza', 'Cardio', 'Flexibilidad'].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Unidad
                        </label>
                        <select
                            value={currentExercise.unidad || 'reps'}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, unidad: e.target.value as any })}
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
                            <option value="reps">Repeticiones</option>
                            <option value="minutos">Minutos</option>
                            <option value="km">Kilómetros</option>
                        </select>
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <Input
                                label="Nombre imagen (ej. press.jpg)"
                                value={currentExercise.imagen || ''}
                                onChange={(e) => setCurrentExercise({ ...currentExercise, imagen: e.target.value })}
                                placeholder="Escribe el nombre del archivo"
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1rem' }}>
                                Pon el archivo en <code>public/exercises/</code>
                            </p>
                        </div>
                        <div>
                            <Input
                                label="Nombre video (ej. press.mp4)"
                                value={currentExercise.video || ''}
                                onChange={(e) => setCurrentExercise({ ...currentExercise, video: e.target.value })}
                                placeholder="Escribe el nombre del archivo"
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1rem' }}>
                                Pon el archivo en <code>public/exercises/</code>
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" isLoading={isSaving}>
                            Guardar Ejercicio
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Exercises;
