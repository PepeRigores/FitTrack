import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { getEjercicios, createEjercicio, updateEjercicio, deleteEjercicio } from '../services/api';
import type { Ejercicio } from '../types';

const Exercises: React.FC = () => {
    const [exercises, setExercises] = useState<Ejercicio[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Partial<Ejercicio>>({});
    const [isSaving, setIsSaving] = useState(false);

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
            descripcion: ''
        });
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Ejercicios</h1>
                <Button onClick={() => openModal()} icon={<Plus size={20} />}>
                    Añadir Ejercicio
                </Button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                    <Input
                        placeholder="Buscar ejercicios..."
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
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                <Button variant="secondary" size="sm" onClick={() => openModal(exercise)} icon={<Edit2 size={16} />}>
                                    Editar
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(exercise.id)} icon={<Trash2 size={16} />}>
                                    Eliminar
                                </Button>
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

                    <Input
                        label="Unidad (e.g., reps, min, km)"
                        value={currentExercise.unidad || ''}
                        onChange={(e) => setCurrentExercise({ ...currentExercise, unidad: e.target.value })}
                        required
                    />

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Descripción
                        </label>
                        <textarea
                            value={currentExercise.descripcion || ''}
                            onChange={(e) => setCurrentExercise({ ...currentExercise, descripcion: e.target.value })}
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
                            Guardar Ejercicio
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Exercises;
