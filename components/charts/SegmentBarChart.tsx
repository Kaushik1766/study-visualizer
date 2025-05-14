import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartDataPoint {
    [key: string]: string | number; // Allows for dynamic keys for bars + xAxisKey (category)
}

interface BarConfig {
    dataKey: string;
    fill: string;
    name: string; // Name for the legend
}

interface SegmentBarChartProps {
    data: BarChartDataPoint[];
    bars: BarConfig[];
    categoryKey: string; // The key in data objects that represents the category (e.g., question option text)
    title?: string;
}

// Predefined colors for the bars - updated with brighter colors for better contrast
export const barColors = [
    '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444',
    '#0ea5e9', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899'
];

const SegmentBarChart: React.FC<SegmentBarChartProps> = ({ data, bars, categoryKey, title }) => {
    if (!data || data.length === 0 || !bars || bars.length === 0) {
        return (
            <p className="text-sm text-center text-foreground py-4">
                No data available to display chart for this section.
            </p>
        );
    }

    // Estimate bottom margin needed for category labels on Y-axis
    const longestLabelLength = data.reduce((max, item) => Math.max(max, String(item[categoryKey]).length), 0);
    const yAxisWidth = Math.min(300, Math.max(100, longestLabelLength * 6 + 20)); // Adjust width based on label length
    const chartHeight = 200 + data.length * bars.length * 10; // Dynamic height based on data points and number of bars

    // Custom tooltip component with theme matching
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card p-3 border border-border shadow-md rounded-md text-foreground">
                    <p className="font-semibold mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm flex items-center gap-2">
                            <span className="w-3 h-3 inline-block" style={{ backgroundColor: entry.color }}></span>
                            <span>{`${entry.name}: ${entry.value}`}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="my-6 p-4 border border-border rounded-lg bg-background">
            {title && <h4 className="text-lg font-semibold text-foreground mb-4 text-center">{title}</h4>}
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={data}
                    layout="vertical" // Horizontal bars
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20, // Increased left margin for Y-axis labels
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fill: 'var(--foreground)' }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={{ stroke: 'var(--border)' }}
                    />
                    <YAxis
                        dataKey={categoryKey}
                        type="category"
                        width={yAxisWidth}
                        interval={0} // Show all labels
                        tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={{ stroke: 'var(--border)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value: string) => <span className="text-foreground">{value}</span>}
                    />
                    {bars.map((bar, index) => (
                        <Bar
                            key={bar.dataKey}
                            dataKey={bar.dataKey}
                            name={bar.name}
                            fill={bar.fill || barColors[index % barColors.length]}
                            barSize={20}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SegmentBarChart;
