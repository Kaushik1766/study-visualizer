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

// Predefined colors for the bars
export const barColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE',
    '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const SegmentBarChart: React.FC<SegmentBarChartProps> = ({ data, bars, categoryKey, title }) => {
    if (!data || data.length === 0 || !bars || bars.length === 0) {
        return <p className="text-sm text-center text-gray-500 py-4">No data available to display chart for this section.</p>;
    }

    // Estimate bottom margin needed for category labels on Y-axis
    const longestLabelLength = data.reduce((max, item) => Math.max(max, String(item[categoryKey]).length), 0);
    const yAxisWidth = Math.min(300, Math.max(100, longestLabelLength * 6 + 20)); // Adjust width based on label length
    const chartHeight = 200 + data.length * bars.length * 10; // Dynamic height based on data points and number of bars

    return (
        <div className="my-6 p-4 border border-gray-200 rounded-lg shadow">
            {title && <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">{title}</h4>}
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                        dataKey={categoryKey}
                        type="category"
                        width={yAxisWidth}
                        interval={0} // Show all labels
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        labelFormatter={(label: string) => <span style={{ fontWeight: 'bold' }}>{label}</span>}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
