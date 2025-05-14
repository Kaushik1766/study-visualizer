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
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile view on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add resize listener
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    // Custom formatter for X-axis labels to truncate long text
    const formatXAxisTick = (value: string) => {
        // On mobile, use numbers that reference the index
        if (isMobile) {
            const index = uniqueXValues.findIndex(x => x === value) + 1;
            return `${index}`;
        }
        // On desktop, truncate if too long
        if (value.length > 15) {
            return `${value.substring(0, 13)}...`;
        }
        return value;
    };

    // Custom formatter for Y-axis labels to truncate long text
    const formatYAxisTick = (value: string) => {
        if (isMobile && value.length > 10) {
            return `${value.substring(0, 8)}...`;
        }
        return value;
    };

    // Custom shape for each cell in the heatmap
    const CustomizedShape = (props: any) => {
        const { cx, cy, payload } = props;
        const cellSize = isMobile ? 12 : 30;

        return (
            <Rectangle
                x={cx - cellSize / 2}
                y={cy - cellSize / 2}
                width={cellSize}
                height={cellSize}
                fill={payload.color}
                stroke="var(--border)"
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
                <div className="bg-card p-3 border border-border shadow-md rounded-md text-foreground max-w-[200px]">
                    <p className="font-semibold text-xs md:text-sm mb-1 break-words">{data.x}</p>
                    <p className="text-xs md:text-sm">{data.y}: <span className="font-medium">{data.value}</span></p>
                </div>
            );
        }
        return null;
    };

    // Calculate height based on device and number of segments
    const mobileBaseHeight = 350;
    const desktopBaseHeight = 450;
    const chartHeight = isMobile
        ? Math.max(mobileBaseHeight, uniqueYValues.length * 25)  // Smaller cell height on mobile
        : Math.max(desktopBaseHeight, uniqueYValues.length * 50);

    // Create a legend with color scale
    const renderColorLegend = () => {
        return (
            <div className="flex flex-col items-center mt-2 md:mt-4 bg-secondary/30 py-1 md:py-2 rounded-md">
                <p className="text-xs md:text-sm text-foreground mb-0 md:mb-1">Value Scale</p>
                <div className="flex items-center">
                    <span className="text-xs text-foreground mr-1 md:mr-2">{minValue}</span>
                    <div className="flex h-4 md:h-6 border border-border shadow-sm">
                        {colorRange.map((color, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: color,
                                    width: isMobile ? '12px' : '24px',
                                    height: '100%'
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-foreground ml-1 md:ml-2">{maxValue}</span>
                </div>
            </div>
        );
    };

    // Create reference key for X-axis labels (especially for mobile)
    const renderFullTextLegend = () => {
        // Show for all mobile views or when we have truncated desktop labels
        if ((isMobile && uniqueXValues.length > 0) || uniqueXValues.some(x => x.length > 15)) {
            return (
                <div className="mt-2 bg-secondary/30 p-1 md:p-2 rounded-md text-xs">
                    <p className="font-medium text-foreground mb-1 px-1">Labels Reference:</p>
                    <div className="max-h-32 overflow-y-auto px-1">
                        {uniqueXValues.map((value, index) => (
                            <div key={index} className="mb-1 p-1 bg-card rounded border border-border text-xs">
                                <span className="font-medium">{index + 1}.</span> {value}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="my-4 p-0 md:p-4 border border-border rounded-lg bg-background">
            {title && <h4 className="text-md md:text-lg font-semibold text-foreground mb-2 md:mb-4 text-center px-2">{title}</h4>}
            <div className="flex justify-between mb-1 md:mb-2 text-xs md:text-sm text-foreground px-2">
                <div>{yAxisTitle}</div>
                <div>{xAxisTitle}</div>
            </div>
            <div className="bg-card border border-border rounded-md">
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <ScatterChart
                        margin={{
                            top: isMobile ? 10 : 20,
                            right: isMobile ? 5 : 50,
                            bottom: isMobile ? 10 : 20,
                            left: isMobile ? 60 : 180, // Less space for Y-axis on mobile
                        }}
                    >
                        <XAxis
                            type="category"
                            dataKey="x"
                            name="option"
                            allowDuplicatedCategory={false}
                            tick={{ fontSize: isMobile ? 10 : 12, fill: 'var(--foreground)' }}
                            interval={0}
                            height={40}
                            angle={0}
                            textAnchor="middle"
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={{ stroke: 'var(--border)' }}
                            tickFormatter={formatXAxisTick}
                        />
                        <YAxis
                            type="category"
                            dataKey="y"
                            name="segment"
                            allowDuplicatedCategory={false}
                            width={isMobile ? 70 : 170}
                            tick={{ fontSize: isMobile ? 10 : 12, fill: 'var(--foreground)' }}
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={{ stroke: 'var(--border)' }}
                            tickFormatter={formatYAxisTick}
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
            {renderFullTextLegend()}
        </div>
    );
};

export default SegmentHeatMap;