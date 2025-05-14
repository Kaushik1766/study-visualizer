import React from 'react';
import { Segment, Question } from '@/types/StudyResponse';

interface SegmentColumn {
    header: string;
    count: number;
}

interface SegmentDataDisplayProps {
    activeSegmentKey: string | null;
    activeSegmentData?: Segment;
    activeSegmentConfig: { key: string; name: string; parentKey: string; isMindsetSubTab: boolean } | null;
    getSegmentDisplayName: (key: string) => string;
    marketSegmentColumns: SegmentColumn[];
    ageDemographicColumns: SegmentColumn[];
    prelimSpecificAgeColumns: SegmentColumn[];
    genderDemographicColumns: SegmentColumn[];
    prelimColumns: SegmentColumn[]; // Added new prop
}

const SegmentDataDisplay: React.FC<SegmentDataDisplayProps> = ({
    activeSegmentKey,
    activeSegmentData,
    activeSegmentConfig,
    getSegmentDisplayName,
    marketSegmentColumns,
    ageDemographicColumns,
    prelimSpecificAgeColumns,
    genderDemographicColumns,
    prelimColumns, // Added new prop
}) => {
    if (!activeSegmentData) {
        return <p className="text-center text-gray-500 py-10">Select a segment tab to view its data.</p>;
    }

    const segmentDisplayName = getSegmentDisplayName(activeSegmentKey || "");

    // Determine if the current view is for Market Segments or its sub-tabs
    const isMarketSegmentsView = activeSegmentConfig?.isMindsetSubTab || segmentDisplayName === 'Market Segments';

    return (
        <div className="mt-6 bg-white shadow-xl rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">{segmentDisplayName} Data</h2>
            <div className="space-y-8">
                {/* Render logic for Market Segments and its sub-tabs (Mindsets) */}
                {isMarketSegmentsView && activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => (
                    <div key={`market-segment-q-${qIndex}`} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                        {marketSegmentColumns.length > 0 && question.options && question.options.length > 0 ? (
                            <div className="overflow-x-auto mb-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                            {marketSegmentColumns.map(col => (
                                                <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {col.header} ({col.count})
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {question.options?.map((option, oIndex) => (
                                            <tr key={`market-segment-q-${qIndex}-opt-${oIndex}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
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
                                                        <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {String(cellValue)}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-sm text-gray-500">No market segment columns or options for this question.</p>}
                    </div>
                ))}

                {/* Render logic for other segment types (Age, Prelim, Gender, etc.) */}
                {!isMarketSegmentsView && activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => {
                    // Existing logic for Age
                    if (segmentDisplayName === 'Age') {
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {ageDemographicColumns.length > 0 && question.options && question.options.length > 0 ? (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                    {ageDemographicColumns.map(col => (
                                                        <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header} ({col.count})</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {question.options?.map((option, oIndex) => (
                                                    <tr key={oIndex}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
                                                        {ageDemographicColumns.map(col => (
                                                            <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {String(option["Age Segments"]?.[col.header] ?? 'N/A')}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No age demographic columns or options for this question.</p>}
                            </div>
                        );
                    }
                    // Updated logic for Prelim
                    else if (segmentDisplayName === 'Prelim') {
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {prelimColumns.length > 0 && question.options && question.options.length > 0 ? (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                    {prelimColumns.map(col => (
                                                        <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {col.header} ({col.count})
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {question.options?.map((option, oIndex) => (
                                                    <tr key={oIndex}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
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
                                                                <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {String(cellValue)}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No prelim columns or options for this question.</p>}
                            </div>
                        );
                    }
                    // Existing logic for Gender
                    else if (segmentDisplayName === 'Gender') {
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {genderDemographicColumns.length > 0 && question.options && question.options.length > 0 ? (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                    {genderDemographicColumns.map(col => (
                                                        <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header} ({col.count})</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {question.options?.map((option, oIndex) => (
                                                    <tr key={oIndex}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
                                                        {genderDemographicColumns.map(col => (
                                                            <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {String(option["Gender Segments"]?.[col.header] ?? 'N/A')}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No gender demographic columns or options for this question.</p>}
                            </div>
                        );
                    } else { // Default rendering for other segment types or when no specific table structure is defined
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {question.options && question.options.length > 0 ? (
                                    <ul className="space-y-2 mb-3">
                                        {question.options?.map((option, oIndex) => (
                                            <li key={oIndex} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                                                {option.optiontext}
                                                {option.Total !== undefined && <span className="ml-2 font-semibold text-indigo-600">(Total: {option.Total})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-500">No options available for this question.</p>}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default SegmentDataDisplay;
