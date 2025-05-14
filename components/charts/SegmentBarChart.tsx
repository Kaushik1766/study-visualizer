import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartDataPoint {
    [key: string]: string | number;
}

interface BarConfig {
    dataKey: string;
    fill: string;
    name: string;
}

interface SegmentBarChartProps {
    data: BarChartDataPoint[];
    bars: BarConfig[];
    categoryKey: string;
    title?: string;
}

export const barColors = [
    '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444',
    '#0ea5e9', '#14b8a6', '#f59e0b', '#6366f1', '#ec4899'
];

const SegmentBarChart: React.FC<SegmentBarChartProps> = ({ data, bars, categoryKey, title }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!data || data.length === 0 || !bars || bars.length === 0) {
        return (
            <p className="text-sm text-center text-foreground py-4">
                No data available to display chart for this section.
            </p>
        );
    }

    const formatCategoryName = (value: string) => {
        if (isMobile && value.length > 15) {
            return `${value.substring(0, 13)}...`;
        }
        return value;
    };

    const longestLabelLength = data.reduce((max, item) => Math.max(max, String(item[categoryKey]).length), 0);
    const yAxisWidth = Math.min(300, Math.max(100, isMobile ? 100 : longestLabelLength * 6 + 20));

    const baseHeight = isMobile ? 350 : 200;
    const itemHeight = isMobile ? 20 : 10;
    const chartHeight = baseHeight + data.length * bars.length * itemHeight;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card p-3 border border-border shadow-md rounded-md text-foreground max-w-[200px]">
                    <p className="font-semibold mb-1 text-wrap break-words text-xs md:text-sm">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-xs md:text-sm flex items-center gap-2">
                            <span className="w-3 h-3 inline-block" style={{ backgroundColor: entry.color }}></span>
                            <span className="truncate">{`${entry.name.split(' ')[0]}: ${entry.value}`}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="my-4 p-0 md:p-4 border border-border rounded-lg bg-background">
            {title && <h4 className="text-md md:text-lg font-semibold text-foreground mb-2 md:mb-4 text-center px-2">{title}</h4>}

            <div className="overflow-hidden">
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{
                            top: isMobile ? 10 : 20,
                            right: isMobile ? 5 : 30,
                            left: 5,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fill: 'var(--foreground)', fontSize: isMobile ? 10 : 12 }}
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={{ stroke: 'var(--border)' }}
                            domain={[0, 'dataMax']}
                            tickCount={isMobile ? 3 : 5}
                        />
                        <YAxis
                            dataKey={categoryKey}
                            type="category"
                            width={yAxisWidth}
                            interval={0}
                            tick={{
                                fill: 'var(--foreground)',
                                fontSize: isMobile ? 10 : 12
                            }}
                            axisLine={{ stroke: 'var(--border)' }}
                            tickLine={{ stroke: 'var(--border)' }}
                            tickFormatter={formatCategoryName}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '10px',
                                fontSize: isMobile ? '10px' : '12px'
                            }}
                            formatter={(value: string) => {
                                if (isMobile) {
                                    const parts = value.split(' ');
                                    return <span className="text-foreground text-xs">{parts[0]}</span>;
                                }
                                return <span className="text-foreground">{value}</span>;
                            }}
                        />
                        {bars.map((bar, index) => (
                            <Bar
                                key={bar.dataKey}
                                dataKey={bar.dataKey}
                                name={bar.name}
                                fill={bar.fill || barColors[index % barColors.length]}
                                barSize={isMobile ? 10 : 20}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {isMobile && data.some(item => String(item[categoryKey]).length > 15) && (
                <div className="mt-2 bg-secondary/30 p-1 md:p-2 rounded-md text-xs">
                    <p className="font-medium text-foreground mb-1 px-1">Full Labels:</p>
                    <div className="max-h-32 overflow-y-auto px-1">
                        {data.map((item, index) => (
                            <div key={index} className="mb-1 p-1 bg-card rounded border border-border">
                                <span className="font-medium">{index + 1}.</span> {String(item[categoryKey])}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SegmentBarChart;
