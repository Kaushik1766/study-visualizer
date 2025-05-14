'use client';

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useStudies } from '@/app/hooks/useStudies';
import { FiArrowLeft } from 'react-icons/fi';

import LoadingState from '@/components/study/LoadingState';
import ErrorDisplay from '@/components/study/ErrorDisplay';
import StudyNotFound from '@/components/study/StudyNotFound';
import StudyDetailHeader from '@/components/study-detail/StudyDetailHeader';
import ViewModeSwitcher, { DisplayPreferenceType } from '@/components/study-detail/ViewModeSwitcher';
import SegmentTabs from '@/components/study-detail/SegmentTabs';
import SegmentDataDisplay from '@/components/study-detail/SegmentDataDisplay';

import { useSegmentData, ActiveViewModeType } from '@/app/hooks/useSegmentData';
import { useSegmentColumns } from '@/app/hooks/useSegmentColumns';
import { formatDate } from '@/app/utils/segmentUtils';
import Link from 'next/link';

const StudyDetailPage = () => {
    const params = useParams();
    const studyId = params.id as string;
    const { data: studies, isLoading, error } = useStudies();
    const [activeViewMode, setActiveViewMode] = useState<ActiveViewModeType>('B');
    const [activeDisplayPreference, setActiveDisplayPreference] = useState<DisplayPreferenceType>('table');

    // Find the current study from the list
    const study = studies?.find(s => s._id === studyId) || null;

    // Use our custom hooks to manage segment data
    const {
        displayableSegments,
        activeSegmentKey,
        setActiveSegmentKey,
        activeSegmentData,
        activeSegmentConfig,
        overallBaseSize,
        handleViewModeChange
    } = useSegmentData(study, activeViewMode);

    // Use our custom hook to calculate segment columns
    const {
        marketSegmentColumns,
        ageDemographicColumns,
        prelimSpecificAgeColumns,
        prelimColumns,
        genderDemographicColumns
    } = useSegmentColumns(
        activeSegmentKey,
        activeSegmentData,
        activeSegmentConfig,
        study,
        activeViewMode,
        displayableSegments
    );

    // Handler for view mode changes
    const onViewModeChange = (mode: ActiveViewModeType) => {
        const newMode = handleViewModeChange(mode);
        setActiveViewMode(newMode);
    };

    // Handler for display preference changes
    const handleDisplayPreferenceChange = (preference: DisplayPreferenceType) => {
        setActiveDisplayPreference(preference);
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
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to all studies</span>
                    </Link>
                </div>

                <StudyDetailHeader
                    study={study}
                    overallBaseSize={overallBaseSize}
                    formatDate={formatDate}
                    onBack={() => window.history.back()}
                />

                <div className="bg-card border border-border rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-medium">Visualization Controls</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <ViewModeSwitcher
                                activeViewMode={activeViewMode}
                                onViewModeChange={onViewModeChange}
                                activeDisplayPreference={activeDisplayPreference}
                                onDisplayPreferenceChange={handleDisplayPreferenceChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg shadow-sm mb-6 overflow-hidden">
                    <SegmentTabs
                        segments={displayableSegments}
                        activeSegmentKey={activeSegmentKey}
                        onSegmentChange={setActiveSegmentKey}
                    />
                </div>

                <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
                    <SegmentDataDisplay
                        activeSegmentKey={activeSegmentKey}
                        activeSegmentData={activeSegmentData}
                        activeSegmentConfig={activeSegmentConfig}
                        marketSegmentColumns={marketSegmentColumns}
                        ageDemographicColumns={ageDemographicColumns}
                        prelimSpecificAgeColumns={prelimSpecificAgeColumns}
                        prelimColumns={prelimColumns}
                        genderDemographicColumns={genderDemographicColumns}
                        activeDisplayPreference={activeDisplayPreference}
                    />
                </div>

                {/* <footer className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">Study data visualization completed</p>
                </footer> */}
            </div>
        </div>
    );
};

export default StudyDetailPage;

