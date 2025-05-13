"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Sector, LabelList } from 'recharts';
import { FiBarChart2, FiPieChart, FiAlertCircle } from 'react-icons/fi';

interface ChartDataItem {
    name: string;
    value: number;
    // Allow any other properties for more complex charts like grouped/stacked
    [key: string]: any;
}

interface StudyChartProps {
    data: ChartDataItem[];
    chartType: 'bar' | 'pie' | 'groupedBar' | 'stackedBar';
    title?: string;
    // For grouped/stacked bar charts
    barKeys?: { key: string; color?: string; name?: string }[]; // Corrected to be an array
    // For pie charts
    pieDataKey?: string;
    // For bar charts
    barDataKey?: string;
    layout?: 'horizontal' | 'vertical';
    aspectRatio?: number;
    showLegend?: boolean;
    showTooltip?: boolean;
    showGrid?: boolean;
    // Custom colors for pie chart
    pieColors?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#A52A2A', '#D2691E', '#FFD700'];

const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value, name } = props;
    const radius = 10;

    // Check if value is a number and not too small to display
    if (typeof value !== 'number' || value < 1) return null;


    // Simple label inside for pie, more complex for bar if needed
    if (props.cx) { // Pie chart label (cx exists for pie)
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const xLabel = cx + radius * Math.cos(-midAngle * RADIAN);
        const yLabel = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Don't render label for very small slices

        return (
            <text
                x={xLabel}
                y={yLabel}
                fill="white"
                textAnchor={xLabel > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="10px"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }

    // For bar chart, position label inside the bar
    if (width < 20 || height < 15) return null; // Don't render if bar is too small

    return (
        <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize="10px">
            {value}
        </text>
    );
};


const StudyChart: React.FC<StudyChartProps> = ({
    data,
    chartType,
    title,
    barKeys,
    pieDataKey = 'value',
    barDataKey = 'value',
    layout = 'horizontal',
    aspectRatio = 16 / 9,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    pieColors = COLORS
}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 min-h-[200px]">
                <FiAlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{title ? `${title}: ` : ''}No data available for this chart.</p>
            </div>
        );
    }

    const chartContent = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={data} layout={layout} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
                        {layout === 'horizontal' ? <XAxis type="category" dataKey="name" tick={{ fontSize: 12 }} /> : <XAxis type="number" tick={{ fontSize: 12 }} />}
                        {layout === 'horizontal' ? <YAxis type="number" tick={{ fontSize: 12 }} /> : <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />}
                        {showTooltip && <Tooltip wrapperStyle={{ fontSize: '12px' }} />}
                        {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
                        <Bar dataKey={barDataKey} fill="#8884d8" radius={[4, 4, 0, 0]}>
                            <LabelList dataKey={barDataKey} content={renderCustomizedLabel} />
                        </Bar>
                    </BarChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={"80%"}
                            fill="#8884d8"
                            dataKey={pieDataKey}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                        </Pie>
                        {showTooltip && <Tooltip wrapperStyle={{ fontSize: '12px' }} />}
                        {showLegend && <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />}
                    </PieChart>
                );
            case 'groupedBar':
            case 'stackedBar':
                if (!barKeys || barKeys.length === 0) {
                    return <p className="text-red-500 text-sm">Error: barKeys are required for grouped/stacked bar charts.</p>;
                }
                return (
                    <BarChart data={data} layout={layout} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
                        {layout === 'horizontal' ? <XAxis type="category" dataKey="name" tick={{ fontSize: 12 }} interval={0} /> : <XAxis type="number" tick={{ fontSize: 12 }} />}
                        {layout === 'horizontal' ? <YAxis type="number" tick={{ fontSize: 12 }} /> : <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} interval={0} />}
                        {showTooltip && <Tooltip wrapperStyle={{ fontSize: '12px' }} />}
                        {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
                        {barKeys.map((bar: { key: string; color?: string; name?: string }, index: number) => (
                            <Bar key={bar.key} dataKey={bar.key} stackId={chartType === 'stackedBar' ? 'a' : undefined} fill={bar.color || COLORS[index % COLORS.length]} name={bar.name || bar.key} radius={[4, 4, 0, 0]}>
                                <LabelList dataKey={bar.key} content={renderCustomizedLabel} />
                            </Bar>
                        ))}
                    </BarChart>
                );
            default:
                return <p className="text-red-500 text-sm">Unsupported chart type: {chartType}</p>;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 h-full flex flex-col">
            {title && <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                {chartType === 'bar' || chartType === 'groupedBar' || chartType === 'stackedBar' ? <FiBarChart2 className="mr-2 text-indigo-500" /> : <FiPieChart className="mr-2 text-indigo-500" />}
                {title}
            </h3>}
            <div style={{ width: '100%', flexGrow: 1, minHeight: 250 }}> {/* Ensure container has height */}
                <ResponsiveContainer width="100%" height="100%" aspect={aspectRatio}>
                    {chartContent()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StudyChart;

// Helper function to generate chart data for "Base Values"
export const prepareBaseValuesChartData = (baseValues: Record<string, string | number | null | undefined>, valueKeys?: string[]): ChartDataItem[] => {
    if (!baseValues) return [];
    return Object.entries(baseValues)
        .filter(([key, value]) => (valueKeys ? valueKeys.includes(key) : true) && value !== null && !key.startsWith("Unnamed:") && typeof value === 'number' && value > 0)
        .map(([key, value]) => ({
            name: key,
            value: value as number,
        }))
        .sort((a: ChartDataItem, b: ChartDataItem) => b.value - a.value); // Sort by value descending
};

// Helper function to generate chart data for question options (Total counts)
export const prepareQuestionOptionsChartData = (questions: any[], questionText: string): ChartDataItem[] => {
    const question = questions?.find(q => q.Question === questionText);
    if (!question || !question.options) return [];
    return question.options
        .filter((opt: any) => typeof opt.Total === 'number')
        .map((opt: any) => ({
            name: opt.optiontext,
            value: opt.Total,
        }))
        .sort((a: ChartDataItem, b: ChartDataItem) => b.value - a.value);
};

// Helper function to generate chart data for grouped/stacked bar charts (e.g., Market Segments or Age/Gender breakdowns)
export const prepareGroupedBarChartData = (
    question: any,
    groupKeys: { key: string; name: string; color?: string }[], // Made color optional here as well
    optionValuePath?: string // Path to the value within option object, e.g. "Mindset A" or "Age Segments.18-24"
): ChartDataItem[] => {
    if (!question || !question.options || !groupKeys || groupKeys.length === 0) return [];

    return question.options.map((option: any) => {
        const dataItem: ChartDataItem = { name: option.optiontext, value: 0 }; // Initialize value, will be overwritten by specific group keys
        groupKeys.forEach(group => {
            // Access nested values if optionValuePath is used, otherwise direct access
            let val = option[group.key]; // Direct access for simple cases like Market Segments

            if (optionValuePath) { // For nested structures like Age Segments
                // e.g. optionValuePath = "Age Segments", group.key = "18-24"
                // then val = option["Age Segments"]["18-24"]
                const pathParts = optionValuePath.split('.');
                let currentVal = option;
                for (const part of pathParts) {
                    if (currentVal && typeof currentVal === 'object' && part in currentVal) {
                        currentVal = currentVal[part];
                    } else {
                        currentVal = undefined;
                        break;
                    }
                }
                if (currentVal && typeof currentVal === 'object' && group.key in currentVal) {
                    val = currentVal[group.key];
                } else if (typeof currentVal === 'object' && !(group.key in currentVal) && optionValuePath === group.key) {
                    // This case is for when group.key itself is the path to the object containing values
                    // and we need to extract all its sub-keys for the chart.
                    // This is more complex and might need a different data prep function.
                    // For now, we assume group.key is a direct property or a sub-property of optionValuePath
                    val = undefined; // Or handle as 0
                } else {
                    val = undefined;
                }
            }


            dataItem[group.key] = (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) ? Number(val) : 0;
        });
        return dataItem;
    });
};
