import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Rectangle, ScatterChart, Scatter } from 'recharts';

interface HeatMapDataPoint {
    x: string; // Category/option
    y: string; // Segment name
    value: number; // The heat value
    color: string; // Color based on the value intensity
}

interface SegmentHeatMapProps {
    data: HeatMapDataPoint[];
    title?: string;
    colorRange?: string[];
    xAxisTitle?: string;
    yAxisTitle?: string;
}

// Updated color range for better contrast with white background
// Using a more vibrant blue-purple gradient
const defaultColorRange = [
    '#e0f2fc', '#c4e4f6', '#99cce8', '#6badd9', '#4f91c8', '#3e74b3', '#2a58a5', '#163e8e', '#082776'
];

const SegmentHeatMap: React.FC<SegmentHeatMapProps> = ({
    data,
    title,
    colorRange = defaultColorRange,
    xAxisTitle = "Options",
    yAxisTitle = "Segments"
}) => {
    const [chartData, setChartData] = useState<HeatMapDataPoint[]>([]);
    const [uniqueXValues, setUniqueXValues] = useState<string[]>([]);
    const [uniqueYValues, setUniqueYValues] = useState<string[]>([]);
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(0);

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Extract unique X and Y values
        const xValues = [...new Set(data.map(item => item.x))];
        const yValues = [...new Set(data.map(item => item.y))];

        // Find min and max values
        const values = data.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);

        setUniqueXValues(xValues);
        setUniqueYValues(yValues);
        setMinValue(min);
        setMaxValue(max);
        setChartData(data);
    }, [data]);

    if (!data || data.length === 0) {
        return <p className="text-sm text-center text-gray-500 py-4">No data available to display heatmap for this section.</p>;
    }

    // Custom shape for each cell in the heatmap
    const CustomizedShape = (props: any) => {
        const { cx, cy, payload } = props;

        return (
            <Rectangle
                x={cx - 15}
                y={cy - 15}
                width={30}
                height={30}
                fill={payload.color}
                stroke="#fff"
                strokeWidth={1}
                className="hover:opacity-80 transition-opacity"
            />
        );
    };

    // Custom tooltip for the heatmap
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
                    <p className="font-semibold text-sm">{data.x}</p>
                    <p className="text-sm">{data.y}: <span className="font-medium">{data.value}</span></p>
                </div>
            );
        }
        return null;
    };

    // Calculate height based on number of segments
    const chartHeight = Math.max(400, uniqueYValues.length * 50);

    // Create a legend with color scale
    const renderColorLegend = () => {
        return (
            <div className="flex flex-col items-center mt-6 bg-gray-50 py-2 rounded-md">
                <p className="text-sm text-gray-700 mb-1">Value Scale</p>
                <div className="flex items-center">
                    <span className="text-xs mr-2">{minValue}</span>
                    <div className="flex h-6 border border-gray-300 shadow-sm">
                        {colorRange.map((color, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: color,
                                    width: '24px',
                                    height: '100%'
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs ml-2">{maxValue}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="my-6 p-4 border border-gray-200 rounded-lg shadow">
            {title && <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">{title}</h4>}
            <div className="flex justify-between mb-2 text-sm text-gray-600">
                <div>{yAxisTitle}</div>
                <div>{xAxisTitle}</div>
            </div>
            <div className="bg-white border border-gray-100 rounded-md">
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 50,
                            bottom: 20,
                            left: 180, // More space for Y-axis labels
                        }}
                    >
                        <XAxis
                            type="category"
                            dataKey="x"
                            name="option"
                            allowDuplicatedCategory={false}
                            tick={{ fontSize: 12 }}
                            interval={0}
                            height={60}
                            angle={-25}
                            textAnchor="end"
                        />
                        <YAxis
                            type="category"
                            dataKey="y"
                            name="segment"
                            allowDuplicatedCategory={false}
                            width={170}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter
                            data={chartData}
                            shape={<CustomizedShape />}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            {renderColorLegend()}
        </div>
    );
};

export default SegmentHeatMap;