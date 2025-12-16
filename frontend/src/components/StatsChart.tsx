import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
    data: { fecha__date: string; count: number }[];
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
    // Format data for chart
    const formattedData = data.map(item => ({
        date: new Date(item.fecha__date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        workouts: item.count
    }));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-secondary)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="var(--text-secondary)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text)'
                        }}
                        cursor={{ fill: 'var(--surface-hover)' }}
                    />
                    <Bar dataKey="workouts" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatsChart;
