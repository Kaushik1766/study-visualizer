'use client';

import { useParams } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';
import { FiArrowLeft, FiLoader, FiAlertTriangle, FiFileText, FiClipboard, FiTable, FiBarChart2, FiPieChart, FiDownload } from 'react-icons/fi';
import { useStudies } from '@/app/hooks/useStudies';
import { StudyResponse, Segment, Question } from '@/types/StudyResponse';

// Helper to get a cleaner display name for segments
const getSegmentDisplayName = (key: string): string => {
    let name = key.replace(/\(B\)|\(R\)|\(T\)/g, "").trim(); // Remove prefixes
    name = name.replace(/segments?|groups?/gi, "").trim(); // Remove "segments", "groups"
    if (name.toLowerCase() === 'mindsets') return 'Market Segments';
    if (name.toLowerCase() === 'prelim-answer') return 'Prelim';
    return name.charAt(0).toUpperCase() + name.slice(1);
};

type ActiveViewModeType = 'T' | 'B' | 'R';

const StudyDetailPage = () => {
    const params = useParams();
    const studyId = params.id as string;
    const { data: studies, isLoading, error } = useStudies();
    const [activeSegmentKey, setActiveSegmentKey] = useState<string | null>(null);
    const [activeViewMode, setActiveViewMode] = useState<ActiveViewModeType>('B');

    const study = useMemo(() => {
        if (!studies || !studyId) return null;
        return studies.find((s: StudyResponse) => s._id === studyId);
    }, [studies, studyId]);

    const displayableSegments = useMemo(() => {
        if (!study?.studyData) return [];
        return Object.keys(study.studyData)
            .filter(key => key.startsWith(`(${activeViewMode})`))
            .map(key => ({
                key,
                name: getSegmentDisplayName(key),
            }))
            .sort((a, b) => {
                if (a.name === "Overall") return -1;
                if (b.name === "Overall") return 1;
                if (a.name === "Market Segments") return -1;
                if (b.name === "Market Segments") return 1;
                return a.name.localeCompare(b.name);
            });
    }, [study?.studyData, activeViewMode]);

    const activeSegmentData: Segment | undefined = useMemo(() => {
        if (!study || !activeSegmentKey) return undefined;
        return study.studyData[activeSegmentKey];
    }, [study, activeSegmentKey]);

    const overallBaseSize = useMemo(() => {
        if (!study) return 0;
        const overallKey = `(${activeViewMode}) Overall` as keyof typeof study.studyData;
        const baseSizeFromOverall = study.studyData[overallKey]?.Data?.['Base Size'];
        return baseSizeFromOverall ?? study.studyRespondents ?? 0;
    }, [study, activeViewMode]);

    const marketSegmentColumns = useMemo(() => {
        const segmentName = activeSegmentKey ? getSegmentDisplayName(activeSegmentKey) : "";
        if (segmentName === 'Market Segments' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => (key.toLowerCase().includes('mindset') || key.toLowerCase().includes('segment')) && value !== null && !key.startsWith("Unnamed:"))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }));
        }
        return [];
    }, [activeSegmentKey, activeSegmentData]);

    const ageDemographicColumns = useMemo(() => {
        const segmentName = activeSegmentKey ? getSegmentDisplayName(activeSegmentKey) : "";
        if (segmentName === 'Age' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => value !== null && !key.startsWith("Unnamed:") && /\d+(?: - \d+)?\+?/.test(key))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }));
        }
        return [];
    }, [activeSegmentKey, activeSegmentData]);

    const prelimSpecificAgeColumns = useMemo(() => {
        const currentSegmentName = activeSegmentKey ? getSegmentDisplayName(activeSegmentKey) : "";
        if (currentSegmentName === 'Prelim' && study?.studyData) {
            const ageSegmentKeyForViewMode = Object.keys(study.studyData).find(key =>
                key.startsWith(`(${activeViewMode})`) && getSegmentDisplayName(key) === 'Age'
            );
            if (ageSegmentKeyForViewMode && study.studyData[ageSegmentKeyForViewMode]?.["Base Values"]) {
                return Object.entries(study.studyData[ageSegmentKeyForViewMode]["Base Values"])
                    .filter(([key, value]) => value !== null && !key.startsWith("Unnamed:") && /\d+(?: - \d+)?\+?/.test(key))
                    .map(([key, value]) => ({ header: key, count: value as number || 0 }));
            }
        }
        return [];
    }, [activeSegmentKey, study?.studyData, activeViewMode]);

    const genderDemographicColumns = useMemo(() => {
        const segmentName = activeSegmentKey ? getSegmentDisplayName(activeSegmentKey) : "";
        if (segmentName === 'Gender' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => (key.toLowerCase() === 'male' || key.toLowerCase() === 'female') && value !== null && !key.startsWith("Unnamed:"))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }));
        }
        return [];
    }, [activeSegmentKey, activeSegmentData]);

    const combinedColumns = useMemo(() => {
        const segmentName = activeSegmentKey ? getSegmentDisplayName(activeSegmentKey) : "";
        if (segmentName === 'Combined' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => value !== null && !key.startsWith("Unnamed:"))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }))
                .sort((a, b) => {
                    if (a.header.match(/^\d/)) return -1;
                    if (b.header.match(/^\d/)) return 1;
                    if (a.header.toLowerCase() === 'male' || a.header.toLowerCase() === 'female') return -1;
                    if (b.header.toLowerCase() === 'male' || b.header.toLowerCase() === 'female') return 1;
                    if (a.header.toLowerCase().includes('mindset')) return -1;
                    if (b.header.toLowerCase().includes('mindset')) return 1;
                    return a.header.localeCompare(b.header);
                });
        }
        return [];
    }, [activeSegmentKey, activeSegmentData]);

    useEffect(() => {
        if (displayableSegments.length > 0) {
            const currentSegmentIsValid = activeSegmentKey && displayableSegments.some(s => s.key === activeSegmentKey);
            if (!currentSegmentIsValid) {
                const overallSegment = displayableSegments.find(s => s.name === "Overall");
                if (overallSegment) {
                    setActiveSegmentKey(overallSegment.key);
                } else if (displayableSegments.length > 0) {
                    setActiveSegmentKey(displayableSegments[0].key);
                } else {
                    setActiveSegmentKey(null);
                }
            }
        } else {
            setActiveSegmentKey(null);
        }
    }, [displayableSegments, activeSegmentKey]);

    const handleViewModeChange = (mode: ActiveViewModeType) => {
        setActiveViewMode(mode);
        setActiveSegmentKey(null);
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
            });
        } catch (e) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-gray-900">
                <FiLoader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-xl font-semibold">Loading study details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-red-600">
                <FiAlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-xl font-semibold">Error loading study: {error.message}</p>
                <button onClick={() => window.history.back()} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <FiArrowLeft className="w-5 h-5 mr-2" /> Go Back
                </button>
            </div>
        );
    }

    if (!study) {
        return (
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <FiAlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Study Not Found</h1>
                    <p className="text-gray-600 mb-8">Sorry, we couldn't find the study with ID: {studyId}.</p>
                    <button onClick={() => window.history.back()} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Studies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => window.history.back()}
                    className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors group"
                >
                    <FiArrowLeft className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-400" />
                    Back to Studies
                </button>

                <header className="mb-6 bg-white shadow-lg rounded-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{study.studyTitle}</h1>
                            <div className="flex flex-wrap text-sm text-gray-600 gap-x-4 gap-y-1">
                                <span>Status: <span className="font-semibold text-gray-700">{study.studyStatus ? (study.studyStatus.toLowerCase().includes('completed') || study.studyStatus.includes('/') ? `Completed on: ${formatDate(study.studyStatus)}` : study.studyStatus) : 'N/A'}</span></span>
                                <span>Surveys Started: <span className="font-semibold text-gray-700">{formatDate(study.studyStarted)}</span></span>
                                <span>Surveys Completed: <span className="font-semibold text-gray-700">{study.studyRespondents} (out of {overallBaseSize})</span></span>
                            </div>
                            {study.studyKeywords && study.studyKeywords.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {study.studyKeywords.map((keyword) => (
                                        <span key={keyword} className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                                <FiFileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                                <FiClipboard className="w-4 h-4 mr-2 text-blue-500" /> Export PPTX
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mb-6 bg-white shadow-md rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <button className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"><FiTable /></button>
                        <button className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"><FiBarChart2 /></button>
                        <button className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"><FiPieChart /></button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleViewModeChange('T')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'T' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Top Down
                        </button>
                        <button
                            onClick={() => handleViewModeChange('B')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'B' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Bottom Up
                        </button>
                        <button
                            onClick={() => handleViewModeChange('R')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'R' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Response Time
                        </button>
                    </div>
                </div>

                <div className="mb-1">
                    <div className="border-b border-gray-300">
                        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                            {displayableSegments.map((segment) => (
                                <button
                                    key={segment.key}
                                    onClick={() => setActiveSegmentKey(segment.key)}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${activeSegmentKey === segment.key
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {segment.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="mt-6 bg-white shadow-xl rounded-xl p-6 md:p-8">
                    {activeSegmentData ? (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6">{getSegmentDisplayName(activeSegmentKey || "")} Data</h2>

                            <div className="space-y-8">
                                {activeSegmentData.Data?.Questions?.map((question, qIndex) => {
                                    const segmentDisplayName = getSegmentDisplayName(activeSegmentKey || "");

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
                                    } else {
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
                    ) : (
                        <p className="text-center text-gray-500 py-10">Select a segment tab to view its data.</p>
                    )}
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-sm text-gray-500">End of Study Details</p>
                </footer>
            </div>
        </div>
    );
};

export default StudyDetailPage;

