'use client';

import { useParams } from 'next/navigation';
import React, { useState, useMemo, useEffect } from 'react';
import { useStudies } from '@/app/hooks/useStudies';
import { StudyResponse, Segment } from '@/types/StudyResponse';

import LoadingState from '@/components/study/LoadingState';
import ErrorDisplay from '@/components/study/ErrorDisplay';
import StudyNotFound from '@/components/study/StudyNotFound';
import StudyDetailHeader from '@/components/study-detail/StudyDetailHeader';
import ViewModeSwitcher, { ActiveViewModeType } from '@/components/study-detail/ViewModeSwitcher';
import SegmentTabs from '@/components/study-detail/SegmentTabs';
import SegmentDataDisplay from '@/components/study-detail/SegmentDataDisplay';

// Helper to get a cleaner display name for segments
const getSegmentDisplayName = (key: string): string => {
    let name = key.replace(/\(B\)|\(R\)|\(T\)/g, "").trim(); // Remove prefixes
    name = name.replace(/segments?|groups?/gi, "").trim(); // Remove "segments", "groups"
    if (name.toLowerCase() === 'mindsets') return 'Market Segments';
    if (name.toLowerCase() === 'prelim-answer') return 'Prelim';
    return name.charAt(0).toUpperCase() + name.slice(1);
};

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
        setActiveSegmentKey(null); // Reset active segment when view mode changes
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        try {
            // Handle cases like "Completed / 05/10/2024"
            const datePart = dateString.includes('/') ? dateString.split('/').slice(-3).join('/') : dateString;
            const cleanedDateString = datePart.replace(/[a-zA-Z]+/g, '').trim(); // Remove any textual part like "Completed"
            if (!cleanedDateString) return dateString; // If only text was present
            return new Date(cleanedDateString).toLocaleDateString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
            });
        } catch (e) {
            return dateString; // Return original if parsing fails
        }
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorDisplay errorMessage={error.message} />;
    }

    if (!study) {
        return <StudyNotFound studyId={studyId} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
            <div className="max-w-7xl mx-auto">
                <StudyDetailHeader
                    study={study}
                    overallBaseSize={overallBaseSize}
                    formatDate={formatDate}
                    onBack={() => window.history.back()}
                />

                <ViewModeSwitcher
                    activeViewMode={activeViewMode}
                    onViewModeChange={handleViewModeChange}
                />

                <SegmentTabs
                    segments={displayableSegments}
                    activeSegmentKey={activeSegmentKey}
                    onSegmentChange={setActiveSegmentKey}
                />

                <SegmentDataDisplay
                    activeSegmentKey={activeSegmentKey}
                    activeSegmentData={activeSegmentData}
                    getSegmentDisplayName={getSegmentDisplayName}
                    marketSegmentColumns={marketSegmentColumns}
                    ageDemographicColumns={ageDemographicColumns}
                    prelimSpecificAgeColumns={prelimSpecificAgeColumns}
                    genderDemographicColumns={genderDemographicColumns}
                    combinedColumns={combinedColumns}
                />

                <footer className="mt-12 text-center">
                    <p className="text-sm text-gray-500">End of Study Details</p>
                </footer>
            </div>
        </div>
    );
};

export default StudyDetailPage;

