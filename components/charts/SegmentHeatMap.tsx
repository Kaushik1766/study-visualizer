import React, { useState } from 'react';

interface HeatMapDataPoint {
    x: string;
    y: string;
    value: number;
    color: string;
}

interface SegmentHeatMapProps {
    data: HeatMapDataPoint[];
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
}

const SegmentHeatMap: React.FC<SegmentHeatMapProps> = ({
    data,
    title,
    xAxisTitle = "Options",
    yAxisTitle = "Segments"
}) => {
    const [hoveredCell, setHoveredCell] = useState<{ x: string, y: string, value: number } | null>(null);

    if (!data || data.length === 0) {
        return <p className="text-sm text-center text-foreground py-4">No data available to display heatmap for this section.</p>;
    }

    const uniqueXValues = [...new Set(data.map(item => item.x))];
    const uniqueYValues = [...new Set(data.map(item => item.y))].reverse();

    const dataMap: Record<string, HeatMapDataPoint> = {};
    data.forEach(item => {
        dataMap[`${item.x}_${item.y}`] = item;
    });

    const getTextColor = (backgroundColor: string): string => {
        if (backgroundColor.startsWith('#')) {
            const r = parseInt(backgroundColor.substring(1, 3), 16);
            const g = parseInt(backgroundColor.substring(3, 5), 16);
            const b = parseInt(backgroundColor.substring(5, 7), 16);

            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#000000' : '#ffffff';
        }
        return '#000000';
    };

    return (
        <div className="my-6 p-4 md:p-6 border border-border rounded-lg bg-background shadow-sm">
            {title && (
                <div className="mb-4 md:mb-6 text-center">
                    <h4 className="text-lg md:text-xl font-semibold text-foreground">{title}</h4>
                </div>
            )}

            {hoveredCell && (
                <div
                    className="fixed z-50 bg-card p-3 rounded-md shadow-lg border border-border max-w-md"
                    style={{
                        top: window.event ? (window.event as MouseEvent).clientY + 10 : 0,
                        left: window.event ? (window.event as MouseEvent).clientX + 10 : 0,
                    }}
                >
                    <div className="mb-1">
                        <span className="font-medium">Option: </span>
                        <span>{hoveredCell.x}</span>
                    </div>
                    <div className="mb-1">
                        <span className="font-medium">Segment: </span>
                        <span>{hoveredCell.y}</span>
                    </div>
                    <div>
                        <span className="font-medium">Value: </span>
                        <span>{hoveredCell.value}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center w-full">
                <div className="w-full max-w-full overflow-x-auto">
                    <table className="w-full border-collapse" style={{
                        tableLayout: 'auto'
                    }}>
                        <thead>
                            <tr>
                                <th className="border-b border-r border-border bg-secondary/20 p-3 font-medium text-foreground text-xs md:text-sm"
                                    style={{ width: '180px', minWidth: '180px' }}>
                                    {yAxisTitle} / {xAxisTitle}
                                </th>
                                {uniqueXValues.map((x, xIndex) => (
                                    <th key={`header-${xIndex}`}
                                        className="border-b border-border p-3 text-center font-medium text-foreground text-xs md:text-sm"
                                        style={{
                                            minWidth: '100px',
                                            maxWidth: '200px',
                                            wordBreak: 'break-word',
                                            whiteSpace: 'normal'
                                        }}
                                    >
                                        {x}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {uniqueYValues.map((y, yIndex) => (
                                <tr key={`row-${yIndex}`}>
                                    <th className="border-r border-border bg-secondary/20 p-3 text-right font-medium text-foreground text-xs md:text-sm"
                                        style={{
                                            wordBreak: 'break-word',
                                            whiteSpace: 'normal',
                                            width: '180px',
                                            minWidth: '180px'
                                        }}
                                    >
                                        {y}
                                    </th>

                                    {uniqueXValues.map((x, xIndex) => {
                                        const dataPoint = dataMap[`${x}_${y}`];
                                        const value = dataPoint?.value ?? 0;
                                        const color = dataPoint?.color || '#f5f5f5';
                                        const textColor = getTextColor(color);

                                        return (
                                            <td
                                                key={`cell-${xIndex}-${yIndex}`}
                                                className="border border-gray-100"
                                                style={{
                                                    backgroundColor: color,
                                                    height: '80px',
                                                    textAlign: 'center',
                                                    verticalAlign: 'middle',
                                                    minWidth: '100px',
                                                    maxWidth: '200px'
                                                }}
                                            >
                                                <div
                                                    className="flex items-center justify-center h-full w-full font-bold text-2xl hover:opacity-90 transition-opacity"
                                                    style={{ color: textColor }}
                                                >
                                                    {value}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-center mb-2">
                    <div className="w-11/12 md:w-4/5 relative h-6 flex">
                        <div className="absolute inset-0 rounded-md shadow-md" style={{
                            backgroundImage: 'linear-gradient(to right, #00cc44, #88cc44, #ffff00, #ffaa00, #ff6600, #cc0000)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                        }}></div>

                        {data.length > 0 && (() => {
                            const values = data.map(d => d.value);
                            const min = Math.min(...values);
                            const max = Math.max(...values);
                            const range = max - min;

                            const markers = [
                                min,
                                min + range * 0.25,
                                min + range * 0.5,
                                min + range * 0.75,
                                max
                            ];

                            return (
                                <>
                                    {markers.map((marker, index) => {
                                        const position = index * 25;
                                        return (
                                            <div
                                                key={`marker-${index}`}
                                                className="absolute -bottom-6 text-xs font-medium"
                                                style={{
                                                    left: `${position}%`,
                                                    transform: index === 0 ? 'none' :
                                                        index === markers.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)'
                                                }}
                                            >
                                                {marker.toFixed(1)}
                                            </div>
                                        );
                                    })}
                                </>
                            );
                        })()}
                    </div>
                </div>

                <div className="text-center mt-8 mb-2">
                    <p className="text-xs text-muted-foreground">
                        Values range from lowest (green) to highest (red)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SegmentHeatMap;