import React, { useEffect, useState } from 'react';
import { Segment, Question, Option } from '@/types/StudyResponse';
import SegmentBarChart, { barColors } from '@/components/charts/SegmentBarChart';
import SegmentHeatMap from '@/components/charts/SegmentHeatMap';
import { getSegmentDisplayName } from '@/app/utils/segmentUtils';
import { SegmentConfig, SegmentColumn, DisplayPreferenceType } from '@/app/hooks/useSegmentData';

type SegmentData = { [key: string]: number };

interface SegmentDataDisplayProps {
    activeSegmentKey: string | null;
    activeSegmentData?: Segment;
    activeSegmentConfig: SegmentConfig | null;
    marketSegmentColumns: SegmentColumn[];
    ageDemographicColumns: SegmentColumn[];
    prelimSpecificAgeColumns: SegmentColumn[];
    genderDemographicColumns: SegmentColumn[];
    prelimColumns: SegmentColumn[];
    activeDisplayPreference: DisplayPreferenceType;
}

const SegmentDataDisplay: React.FC<SegmentDataDisplayProps> = ({
    activeSegmentKey,
    activeSegmentData,
    activeSegmentConfig,
    marketSegmentColumns,
    ageDemographicColumns,
    prelimSpecificAgeColumns,
    genderDemographicColumns,
    prelimColumns,
    activeDisplayPreference,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!activeSegmentData) {
        return (
            <div className="text-center text-muted-foreground py-6 bg-card border border-border rounded-lg">
                Select a segment tab to view its data.
            </div>
        );
    }

    const segmentDisplayName = activeSegmentKey ? getSegmentDisplayName(activeSegmentKey) : "";
    const isMarketSegmentsView = activeSegmentConfig?.isMindsetSubTab || segmentDisplayName === 'Market Segments';

    const getColorForValue = (value: number, minValue: number, maxValue: number) => {
        if (minValue === maxValue) return '#f1c40f';

        const absMax = Math.max(Math.abs(minValue), Math.abs(maxValue));

        const normalizedValue = (value - minValue) / (maxValue - minValue);

        let r, g, b = 0;

        if (value === minValue) return '#00cc44';
        if (value === maxValue) return '#cc0000';

        if (normalizedValue < 0.5) {
            r = Math.round(255 * (2 * normalizedValue));
            g = 255;
        } else {
            r = 255;
            g = Math.round(255 * (2 - 2 * normalizedValue));
        }

        const toHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const transformDataForChart = (question: Question, relevantColumns: SegmentColumn[], dataKeyPrefix: string) => {
        if (!question.options || question.options.length === 0 || relevantColumns.length === 0) {
            return { chartData: [], bars: [] };
        }

        const chartData = question.options.map(option => {
            const dataPoint: { [key: string]: string | number } = { name: option.optiontext };
            relevantColumns.forEach(col => {
                let value: string | number | undefined | null = 'N/A';
                if (isMarketSegmentsView && option.Mindsets && Array.isArray(option.Mindsets)) {
                    const mindsetObject = option.Mindsets.find(m => m && typeof m === 'object' && m.hasOwnProperty(col.header));
                    if (mindsetObject) value = mindsetObject[col.header];
                } else if (segmentDisplayName === 'Age' && option["Age Segments"]) {
                    value = option["Age Segments"]?.[col.header];
                } else if (segmentDisplayName === 'Prelim' && option["Prelim-Answer Segments"] && Array.isArray(option["Prelim-Answer Segments"])) {
                    const prelimSegment = option["Prelim-Answer Segments"].find(s => s && typeof s === 'object' && s.hasOwnProperty(col.header));
                    if (prelimSegment) value = prelimSegment[col.header];
                } else if (segmentDisplayName === 'Gender' && option["Gender Segments"]) {
                    value = option["Gender Segments"]?.[col.header];
                } else if (option.Total !== undefined && relevantColumns.length === 1 && relevantColumns[0].header === "Total") {
                    value = option.Total;
                } else {
                    const genericSegmentKey = `${dataKeyPrefix} Segments`;
                    const segmentData = option[genericSegmentKey] as SegmentData | undefined;
                    if (segmentData) {
                        value = segmentData[col.header];
                    }
                }
                dataPoint[col.header] = (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) ? Number(value) : 0;
            });
            return dataPoint;
        });

        const bars = relevantColumns.map((col, index) => ({
            dataKey: col.header,
            name: `${col.header} (${col.count})`,
            fill: barColors[index % barColors.length],
        }));

        return { chartData, bars };
    };

    const transformDataForHeatmap = (question: Question, relevantColumns: SegmentColumn[], dataKeyPrefix: string) => {
        if (!question.options || question.options.length === 0 || relevantColumns.length === 0) {
            return { heatmapData: [] };
        }

        const allValues: number[] = [];
        const heatmapData = [];

        for (const option of question.options) {
            for (const col of relevantColumns) {
                let value: number = 0;

                if (isMarketSegmentsView && option.Mindsets && Array.isArray(option.Mindsets)) {
                    const mindsetObject = option.Mindsets.find(m => m && typeof m === 'object' && m.hasOwnProperty(col.header));
                    if (mindsetObject) {
                        const val = mindsetObject[col.header];
                        if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                            value = Number(val);
                            allValues.push(value);
                        }
                    }
                } else if (segmentDisplayName === 'Age' && option["Age Segments"]) {
                    const val = option["Age Segments"]?.[col.header];
                    if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                        value = Number(val);
                        allValues.push(value);
                    }
                } else if (segmentDisplayName === 'Prelim' && option["Prelim-Answer Segments"] && Array.isArray(option["Prelim-Answer Segments"])) {
                    const prelimSegment = option["Prelim-Answer Segments"].find(s => s && typeof s === 'object' && s.hasOwnProperty(col.header));
                    if (prelimSegment) {
                        const val = prelimSegment[col.header];
                        if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                            value = Number(val);
                            allValues.push(value);
                        }
                    }
                } else if (segmentDisplayName === 'Gender' && option["Gender Segments"]) {
                    const val = option["Gender Segments"]?.[col.header];
                    if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                        value = Number(val);
                        allValues.push(value);
                    }
                } else if (option.Total !== undefined && relevantColumns.length === 1 && relevantColumns[0].header === "Total") {
                    value = Number(option.Total);
                    allValues.push(value);
                } else {
                    const genericSegmentKey = `${dataKeyPrefix} Segments`;
                    const segmentData = option[genericSegmentKey] as SegmentData | undefined;
                    if (segmentData) {
                        const val = segmentData[col.header];
                        if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                            value = Number(val);
                            allValues.push(value);
                        }
                    }
                }
            }
        }

        const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
        const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;

        for (const option of question.options) {
            for (const col of relevantColumns) {
                let value: number = 0;
                let valueFound = false;

                if (isMarketSegmentsView && option.Mindsets && Array.isArray(option.Mindsets)) {
                    const mindsetObject = option.Mindsets.find(m => m && typeof m === 'object' && m.hasOwnProperty(col.header));
                    if (mindsetObject) {
                        const val = mindsetObject[col.header];
                        if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                            value = Number(val);
                            valueFound = true;
                        }
                    }
                } else if (segmentDisplayName === 'Age' && option["Age Segments"]) {
                    const val = option["Age Segments"]?.[col.header];
                    if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                        value = Number(val);
                        valueFound = true;
                    }
                } else if (segmentDisplayName === 'Prelim' && option["Prelim-Answer Segments"] && Array.isArray(option["Prelim-Answer Segments"])) {
                    const prelimSegment = option["Prelim-Answer Segments"].find(s => s && typeof s === 'object' && s.hasOwnProperty(col.header));
                    if (prelimSegment) {
                        const val = prelimSegment[col.header];
                        if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                            value = Number(val);
                            valueFound = true;
                        }
                    }
                } else if (segmentDisplayName === 'Gender' && option["Gender Segments"]) {
                    const val = option["Gender Segments"]?.[col.header];
                    if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                        value = Number(val);
                        valueFound = true;
                    }
                } else if (option.Total !== undefined && relevantColumns.length === 1 && relevantColumns[0].header === "Total") {
                    value = Number(option.Total);
                    valueFound = true;
                } else {
                    const genericSegmentKey = `${dataKeyPrefix} Segments`;
                    const segmentData = option[genericSegmentKey] as SegmentData | undefined;
                    if (segmentData) {
                        const val = segmentData[col.header];
                        if (typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)))) {
                            value = Number(val);
                            valueFound = true;
                        }
                    }
                }

                if (valueFound) {
                    heatmapData.push({
                        x: option.optiontext,
                        y: col.header,
                        value,
                        color: getColorForValue(value, minValue, maxValue)
                    });
                }
            }
        }

        return { heatmapData };
    };

    return (
        <div className="mt-4 bg-card border border-border rounded-lg p-2 md:p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">{segmentDisplayName} Data</h2>
            {activeDisplayPreference === 'table' ? (
                <div className="space-y-4 md:space-y-8">
                    {isMarketSegmentsView && activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => (
                        <div key={`market-segment-q-${qIndex}`} className="border border-border rounded-lg p-2 md:p-4 bg-background/50">
                            <h3 className="text-lg md:text-xl font-medium mb-2 text-foreground">{question.Question}</h3>
                            {marketSegmentColumns.length > 0 && question.options && question.options.length > 0 ? (
                                <div className="overflow-x-auto -mx-2">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead className="bg-primary/5">
                                            <tr>
                                                <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Response</th>
                                                {marketSegmentColumns.map(col => (
                                                    <th key={col.header} scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                        {col.header} {isMobile ? '' : `(${col.count})`}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-card divide-y divide-border">
                                            {question.options?.map((option, oIndex) => (
                                                <tr key={`market-segment-q-${qIndex}-opt-${oIndex}`} className="hover:bg-secondary/30 transition-colors">
                                                    <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm font-medium text-foreground">
                                                        {isMobile && option.optiontext.length > 25
                                                            ? `${option.optiontext.substring(0, 23)}...`
                                                            : option.optiontext}
                                                    </td>
                                                    {marketSegmentColumns.map(col => {
                                                        let cellValue: string | number = 'N/A';
                                                        if (option.Mindsets && Array.isArray(option.Mindsets)) {
                                                            const mindsetObject = option.Mindsets.find(
                                                                m => m && typeof m === 'object' && m.hasOwnProperty(col.header)
                                                            );
                                                            if (mindsetObject) {
                                                                const val = mindsetObject[col.header];
                                                                if (val !== undefined && val !== null) {
                                                                    cellValue = val;
                                                                }
                                                            }
                                                        }
                                                        return (
                                                            <td key={col.header} className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm text-foreground">
                                                                {String(cellValue)}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : <p className="text-sm text-foreground">No market segment columns or options for this question.</p>}
                        </div>
                    ))}

                    {/* Display for non-market segments data */}
                    {!isMarketSegmentsView && activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => {
                        if (segmentDisplayName === 'Age') {
                            return (
                                <div key={qIndex} className="border border-border rounded-lg p-2 md:p-4 bg-background/50">
                                    <h3 className="text-lg md:text-xl font-medium mb-2 text-foreground">{question.Question}</h3>
                                    {ageDemographicColumns.length > 0 && question.options && question.options.length > 0 ? (
                                        <div className="overflow-x-auto -mx-2">
                                            <table className="min-w-full divide-y divide-border">
                                                <thead className="bg-primary/5">
                                                    <tr>
                                                        <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Response</th>
                                                        {ageDemographicColumns.map(col => (
                                                            <th key={col.header} scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{col.header} ({col.count})</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-card divide-y divide-border">
                                                    {question.options?.map((option, oIndex) => (
                                                        <tr key={oIndex} className="hover:bg-secondary/30 transition-colors">
                                                            <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm font-medium text-foreground">
                                                                {isMobile && option.optiontext.length > 25
                                                                    ? `${option.optiontext.substring(0, 23)}...`
                                                                    : option.optiontext}
                                                            </td>
                                                            {ageDemographicColumns.map(col => (
                                                                <td key={col.header} className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm text-foreground">
                                                                    {String(option["Age Segments"]?.[col.header] ?? 'N/A')}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-sm text-foreground">No age demographic columns or options for this question.</p>}
                                </div>
                            );
                        } else if (segmentDisplayName === 'Prelim') {
                            return (
                                <div key={qIndex} className="border border-border rounded-lg p-2 md:p-4 bg-background/50">
                                    <h3 className="text-lg md:text-xl font-medium mb-2 text-foreground">{question.Question}</h3>
                                    {prelimColumns.length > 0 && question.options && question.options.length > 0 ? (
                                        <div className="overflow-x-auto -mx-2">
                                            <table className="min-w-full divide-y divide-border">
                                                <thead className="bg-primary/5">
                                                    <tr>
                                                        <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Response</th>
                                                        {prelimColumns.map(col => (
                                                            <th key={col.header} scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                                                {col.header} ({col.count})
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-card divide-y divide-border">
                                                    {question.options?.map((option, oIndex) => (
                                                        <tr key={oIndex} className="hover:bg-secondary/30 transition-colors">
                                                            <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm font-medium text-foreground">
                                                                {isMobile && option.optiontext.length > 25
                                                                    ? `${option.optiontext.substring(0, 23)}...`
                                                                    : option.optiontext}
                                                            </td>
                                                            {prelimColumns.map(col => {
                                                                let cellValue: string | number = 'N/A';
                                                                if (option["Prelim-Answer Segments"] && Array.isArray(option["Prelim-Answer Segments"])) {
                                                                    const prelimSegment = option["Prelim-Answer Segments"].find(
                                                                        s => s && typeof s === 'object' && s.hasOwnProperty(col.header)
                                                                    );
                                                                    if (prelimSegment) {
                                                                        const val = prelimSegment[col.header];
                                                                        if (val !== undefined && val !== null) {
                                                                            cellValue = val;
                                                                        }
                                                                    }
                                                                }
                                                                return (
                                                                    <td key={col.header} className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm text-foreground">
                                                                        {String(cellValue)}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-sm text-foreground">No prelim columns or options for this question.</p>}
                                </div>
                            );
                        } else if (segmentDisplayName === 'Gender') {
                            return (
                                <div key={qIndex} className="border border-border rounded-lg p-2 md:p-4 bg-background/50">
                                    <h3 className="text-lg md:text-xl font-medium mb-2 text-foreground">{question.Question}</h3>
                                    {genderDemographicColumns.length > 0 && question.options && question.options.length > 0 ? (
                                        <div className="overflow-x-auto -mx-2">
                                            <table className="min-w-full divide-y divide-border">
                                                <thead className="bg-primary/5">
                                                    <tr>
                                                        <th scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">Response</th>
                                                        {genderDemographicColumns.map(col => (
                                                            <th key={col.header} scope="col" className="px-2 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">{col.header} ({col.count})</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-card divide-y divide-border">
                                                    {question.options?.map((option, oIndex) => (
                                                        <tr key={oIndex} className="hover:bg-secondary/30 transition-colors">
                                                            <td className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm font-medium text-foreground">
                                                                {isMobile && option.optiontext.length > 25
                                                                    ? `${option.optiontext.substring(0, 23)}...`
                                                                    : option.optiontext}
                                                            </td>
                                                            {genderDemographicColumns.map(col => (
                                                                <td key={col.header} className="px-2 py-2 md:px-6 md:py-4 text-xs md:text-sm text-foreground">
                                                                    {String(option["Gender Segments"]?.[col.header] ?? 'N/A')}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p className="text-sm text-foreground">No gender demographic columns or options for this question.</p>}
                                </div>
                            );
                        } else {
                            return (
                                <div key={qIndex} className="border border-border rounded-lg p-2 md:p-4 bg-background/50">
                                    <h3 className="text-lg md:text-xl font-medium mb-2 text-foreground">{question.Question}</h3>
                                    {question.options && question.options.length > 0 ? (
                                        <ul className="space-y-2 mb-3">
                                            {question.options?.map((option, oIndex) => (
                                                <li key={oIndex} className="text-sm text-foreground p-2 bg-secondary/30 rounded">
                                                    {option.optiontext}
                                                    {option.Total !== undefined && <span className="ml-2 font-semibold text-primary">(Total: {option.Total})</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-foreground">No options available for this question.</p>}
                                </div>
                            );
                        }
                    })}
                </div>
            ) : activeDisplayPreference === 'chart' ? (
                <div className="space-y-8">
                    {activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => {
                        let relevantColumns: SegmentColumn[] = [];
                        let dataKeyPrefix = "";

                        if (isMarketSegmentsView) {
                            relevantColumns = marketSegmentColumns;
                            dataKeyPrefix = "Mindsets";
                        } else if (segmentDisplayName === 'Age') {
                            relevantColumns = ageDemographicColumns;
                            dataKeyPrefix = "Age";
                        } else if (segmentDisplayName === 'Prelim') {
                            relevantColumns = prelimColumns;
                            dataKeyPrefix = "Prelim-Answer";
                        } else if (segmentDisplayName === 'Gender') {
                            relevantColumns = genderDemographicColumns;
                            dataKeyPrefix = "Gender";
                        } else {
                            if (question.options?.some(opt => opt.Total !== undefined)) {
                                relevantColumns = [{ header: "Total", count: activeSegmentData.Data?.["Base Size"] || 0 }];
                                dataKeyPrefix = segmentDisplayName;
                            }
                        }

                        const { chartData, bars } = transformDataForChart(question, relevantColumns, dataKeyPrefix);

                        return (
                            <div key={`chart-q-${qIndex}`} className="border border-border rounded-lg p-4">
                                <SegmentBarChart
                                    title={question.Question}
                                    data={chartData}
                                    bars={bars}
                                    categoryKey="name"
                                />
                            </div>
                        );
                    })}
                    {(!activeSegmentData.Data?.Questions || activeSegmentData.Data.Questions.length === 0) && (
                        <div className="text-center text-muted-foreground py-10 bg-secondary/30 rounded-lg">
                            No questions available to display charts for this segment.
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => {
                        let relevantColumns: SegmentColumn[] = [];
                        let dataKeyPrefix = "";

                        if (isMarketSegmentsView) {
                            relevantColumns = marketSegmentColumns;
                            dataKeyPrefix = "Mindsets";
                        } else if (segmentDisplayName === 'Age') {
                            relevantColumns = ageDemographicColumns;
                            dataKeyPrefix = "Age";
                        } else if (segmentDisplayName === 'Prelim') {
                            relevantColumns = prelimColumns;
                            dataKeyPrefix = "Prelim-Answer";
                        } else if (segmentDisplayName === 'Gender') {
                            relevantColumns = genderDemographicColumns;
                            dataKeyPrefix = "Gender";
                        } else {
                            if (question.options?.some(opt => opt.Total !== undefined)) {
                                relevantColumns = [{ header: "Total", count: activeSegmentData.Data?.["Base Size"] || 0 }];
                                dataKeyPrefix = segmentDisplayName;
                            }
                        }

                        const { heatmapData } = transformDataForHeatmap(question, relevantColumns, dataKeyPrefix);

                        return (
                            <div key={`heatmap-q-${qIndex}`} className="border border-border rounded-lg p-4">
                                <SegmentHeatMap
                                    title={question.Question}
                                    data={heatmapData}
                                    xAxisTitle="Options"
                                    yAxisTitle="Segments"
                                />
                            </div>
                        );
                    })}
                    {(!activeSegmentData.Data?.Questions || activeSegmentData.Data.Questions.length === 0) && (
                        <div className="text-center text-muted-foreground py-10 bg-secondary/30 rounded-lg">
                            No questions available to display heatmaps for this segment.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SegmentDataDisplay;
