import React, { useEffect, useState } from 'react';
import { Activity, Dumbbell, Calendar } from 'lucide-react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import StatsChart from '../components/StatsChart';
import { getEstadisticas } from '../services/api';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getEstadisticas();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)' }}>
                            <Activity color="var(--primary)" size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Workouts</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.total_entrenamientos || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(236, 72, 153, 0.1)', borderRadius: 'var(--radius-md)' }}>
                            <Dumbbell color="var(--secondary)" size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Exercises Logged</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.total_ejercicios_registrados || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)' }}>
                            <Calendar color="var(--success)" size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Days</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.entrenamientos_chart?.length || 0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <Card title="Workouts (Last 30 Days)">
                    {stats?.entrenamientos_chart && <StatsChart data={stats.entrenamientos_chart} />}
                </Card>

                <Card title="Most Frequent Exercises">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats?.ejercicios_frecuentes?.map((item: any, index: number) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: 500 }}>{item.ejercicio__nombre}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>{item.count} times</span>
                            </div>
                        ))}
                        {(!stats?.ejercicios_frecuentes || stats.ejercicios_frecuentes.length === 0) && (
                            <p style={{ color: 'var(--text-secondary)' }}>No exercises recorded yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
