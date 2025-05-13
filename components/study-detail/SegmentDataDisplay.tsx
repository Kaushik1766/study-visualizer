import React from 'react';
import { Segment, Question } from '@/types/StudyResponse';

interface SegmentColumn {
    header: string;
    count: number;
}

interface SegmentDataDisplayProps {
    activeSegmentKey: string | null;
    activeSegmentData?: Segment;
    getSegmentDisplayName: (key: string) => string;
    marketSegmentColumns: SegmentColumn[];
    ageDemographicColumns: SegmentColumn[];
    prelimSpecificAgeColumns: SegmentColumn[];
    genderDemographicColumns: SegmentColumn[];
    combinedColumns: SegmentColumn[];
}

const SegmentDataDisplay: React.FC<SegmentDataDisplayProps> = ({
    activeSegmentKey,
    activeSegmentData,
    getSegmentDisplayName,
    marketSegmentColumns,
    ageDemographicColumns,
    prelimSpecificAgeColumns,
    genderDemographicColumns,
    combinedColumns,
}) => {
    if (!activeSegmentData) {
        return <p className="text-center text-gray-500 py-10">Select a segment tab to view its data.</p>;
    }

    const segmentDisplayName = getSegmentDisplayName(activeSegmentKey || "");

    return (
        <div className="mt-6 bg-white shadow-xl rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">{segmentDisplayName} Data</h2>
            <div className="space-y-8">
                {activeSegmentData.Data?.Questions?.map((question: Question, qIndex: number) => {
                    if (segmentDisplayName === 'Market Segments') {
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {marketSegmentColumns.length > 0 && question.options && question.options.length > 0 ? (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                    {marketSegmentColumns.map(col => (
                                                        <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header} ({col.count})</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {question.options?.map((option, oIndex) => (
                                                    <tr key={oIndex}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
                                                        {marketSegmentColumns.map(col => {
                                                            let valueToShow = 'N/A';
                                                            if (option.Mindsets && Array.isArray(option.Mindsets)) {
                                                                const mindsetData = option.Mindsets.find(m => typeof m === 'object' && m !== null && m[col.header] !== undefined);
                                                                if (mindsetData) valueToShow = String(mindsetData[col.header]);
                                                            } else if ((option as any)[col.header] !== undefined) {
                                                                valueToShow = String((option as any)[col.header]);
                                                            }
                                                            return (
                                                                <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{valueToShow}</td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No market segment columns or options for this question.</p>}
                            </div>
                        );
                    } else if (segmentDisplayName === 'Age') {
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
                    } else if (segmentDisplayName === 'Prelim') {
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {prelimSpecificAgeColumns.length > 0 && question.options && question.options.length > 0 ? (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                    {prelimSpecificAgeColumns.map(col => (
                                                        <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col.header} ({col.count})</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {question.options?.map((option, oIndex) => (
                                                    <tr key={oIndex}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
                                                        {prelimSpecificAgeColumns.map(col => (
                                                            <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {String(option["Age Segments"]?.[col.header] ?? 'N/A')}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No age breakdown columns available or no options for this question.</p>}
                            </div>
                        );
                    } else if (segmentDisplayName === 'Gender') {
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
                    } else if (segmentDisplayName === 'Combined') {
                        return (
                            <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">{question.Question}</h3>
                                {combinedColumns.length > 0 && question.options && question.options.length > 0 ? (
                                    <div className="overflow-x-auto mb-4">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                                                    {combinedColumns.map(col => (
                                                        <th key={col.header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">{col.header} ({col.count})</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {question.options?.map((option, oIndex) => (
                                                    <tr key={oIndex}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{option.optiontext}</td>
                                                        {combinedColumns.map(col => {
                                                            let valueToShow = 'N/A';
                                                            const colHeaderStr = col.header;

                                                            if (option.Mindsets && Array.isArray(option.Mindsets) &&
                                                                (colHeaderStr.toLowerCase().includes('mindset') || colHeaderStr.toLowerCase().includes('segment'))) {
                                                                const mindsetData = option.Mindsets.find(m => typeof m === 'object' && m !== null && m[colHeaderStr] !== undefined);
                                                                if (mindsetData) {
                                                                    valueToShow = String((mindsetData as any)[colHeaderStr]);
                                                                }
                                                            } else if (/\d+(?: - \d+)?\+?/.test(colHeaderStr) && option["Age Segments"]?.[colHeaderStr] !== undefined) {
                                                                valueToShow = String(option["Age Segments"][colHeaderStr]);
                                                            } else if ((colHeaderStr.toLowerCase() === 'male' || colHeaderStr.toLowerCase() === 'female') && option["Gender Segments"]?.[colHeaderStr] !== undefined) {
                                                                valueToShow = String(option["Gender Segments"][colHeaderStr]);
                                                            } else if ((option as any)[colHeaderStr] !== undefined) {
                                                                valueToShow = String((option as any)[colHeaderStr]);
                                                            }
                                                            return (
                                                                <td key={col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{valueToShow}</td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No combined columns or options for this question.</p>}
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
