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

// Updated color range for better contrast
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
        return <p className="text-sm text-center text-foreground py-4">No data available to display heatmap for this section.</p>;
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
                stroke="var(--border)"
                strokeWidth={1}
                className="hover:opacity-80 transition-opacity"
            />
        );
    };

    // Custom formatter for X-axis labels to truncate long text
    const formatXAxisTick = (value: string) => {
        // If the value is longer than 20 characters, truncate it
        if (value.length > 20) {
            return `${value.substring(0, 18)}...`;
        }
        return value;
    };

    // Custom tooltip for the heatmap
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-card p-3 border border-border shadow-md rounded-md text-foreground">
                    <p className="font-semibold text-sm mb-1">{data.x}</p>
                    <p className="text-sm">{data.y}: <span className="font-medium">{data.value}</span></p>
                </div>
            );
        }
        return null;
    };

    // Calculate height based on number of segments
    const chartHeight = Math.max(450, uniqueYValues.length * 50);

    // Create a legend with color scale
    const renderColorLegend = () => {
        return (
            <div className="flex flex-col items-center mt-6 bg-secondary/30 py-2 rounded-md">
                <p className="text-sm text-foreground mb-1">Value Scale</p>
                <div className="flex items-center">
                    <span className="text-xs text-foreground mr-2">{minValue}</span>
                    <div className="flex h-6 border border-border shadow-sm">
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
                    <span className="text-xs text-foreground ml-2">{maxValue}</span>
                </div>
            </div>
        );
    };

    // Create a key for X-axis labels with full text
    const renderFullTextLegend = () => {
        // Only show this if we have truncated some labels
        if (!data.some(item => item.x.length > 20)) return null;

        return (
            <div className="mt-6 bg-secondary/30 p-4 rounded-md overflow-auto max-h-40">
                <p className="text-sm font-medium text-foreground mb-2">Full Labels:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {uniqueXValues.map((value, index) => (
                        <div key={index} className="text-xs text-foreground p-1 bg-card rounded border border-border">
                            <span className="font-medium">{index + 1}.</span> {value}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="my-6 p-4 border border-border rounded-lg bg-background">
            {title && <h4 className="text-lg font-semibold text-foreground mb-4 text-center">{title}</h4>}
            <div className="flex justify-between mb-2 text-sm text-foreground">
                <div>{yAxisTitle}</div>
                <div>{xAxisTitle}</div>
            </div>
            <div className="bg-card border border-border rounded-md">
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 50,
                            bottom: 40, // Reduced bottom margin since we're truncating
                            left: 180, // Space for Y-axis labels
                        }}
                    >
                        <XAxis
                            type="category"
                            dataKey="x"
                            name="option"
                            allowDuplicatedCategory={false}
                            tick={{ fontSize: 11, fill: 'var(--foreground)' }}
                            interval={0}
                            height={50}
                            angle={0} // Horizontal text
                            textAnchor="middle"
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={{ stroke: 'var(--border)' }}
                            tickFormatter={formatXAxisTick} // Apply the formatter
                        />
                        <YAxis
                            type="category"
                            dataKey="y"
                            name="segment"
                            allowDuplicatedCategory={false}
                            width={170}
                            tick={{ fontSize: 12, fill: 'var(--foreground)' }}
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={{ stroke: 'var(--border)' }}
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
            {renderFullTextLegend()} {/* Add the full text legend */}
        </div>
    );
};

export default SegmentHeatMap;