'use client'
import { StudyResponse } from '@/types/StudyResponse'
import React, { useState, useMemo } from 'react'
import { useStudies } from './hooks/useStudies'
import { FiCheckCircle, FiClock, FiCalendar, FiFilter, FiGrid, FiList, FiSearch } from 'react-icons/fi'
import FilterPanel from '@/components/FilterPanel'
import StudyCard from '@/components/StudyCard'
import NoStudiesFound from '@/components/NoStudiesFound'

const getVisualStatus = (study: StudyResponse) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let statusText = study.studyStatus;
    let badgeClass = 'bg-muted text-muted-foreground';
    let IconComponent: React.ElementType | null = null;

    const lowerCaseStatus = study.studyStatus?.toLowerCase();

    if (lowerCaseStatus === 'completed') {
        statusText = 'Completed';
        badgeClass = 'bg-green-100 text-green-700';
        IconComponent = FiCheckCircle;
    } else if (lowerCaseStatus === 'ongoing') {
        statusText = 'Ongoing';
        badgeClass = 'bg-yellow-100 text-yellow-700';
        IconComponent = FiClock;
    } else {
        try {
            const endDate = study.studyEnded ? new Date(study.studyEnded) : null;
            const startDate = study.studyStarted ? new Date(study.studyStarted) : null;

            if (endDate && !isNaN(endDate.getTime()) && endDate.getTime() < today.getTime()) {
                statusText = 'Completed';
                badgeClass = 'bg-green-100 text-green-700';
                IconComponent = FiCheckCircle;
            } else if (startDate && !isNaN(startDate.getTime()) && startDate.getTime() <= today.getTime() && (!endDate || isNaN(endDate.getTime()) || endDate.getTime() >= today.getTime())) {
                statusText = 'Ongoing';
                badgeClass = 'bg-yellow-100 text-yellow-700';
                IconComponent = FiClock;
            } else if (startDate && !isNaN(startDate.getTime()) && startDate.getTime() > today.getTime()) {
                statusText = 'Scheduled';
                badgeClass = 'bg-blue-100 text-blue-700';
                IconComponent = FiCalendar;
            } else {
                statusText = study.studyStatus;
                badgeClass = 'bg-muted text-muted-foreground';
            }
        } catch (e) {
            console.warn("Error parsing study dates for status determination:", e);
            statusText = study.studyStatus;
            badgeClass = 'bg-muted text-muted-foreground';
        }
    }
    return { text: statusText, badgeClass, IconComponent };
};

function Page() {
    const { data: studies, error, isLoading } = useStudies()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const allTags = useMemo(() => {
        if (!studies) return [];
        const tagsSet = new Set<string>();
        studies.forEach(study => {
            study.studyKeywords?.forEach(tag => tagsSet.add(tag));
        });
        return Array.from(tagsSet).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }, [studies]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
        setStartDateFilter('');
        setEndDateFilter('');
    };

    const filteredStudies = useMemo(() => {
        if (!studies) return [];
        return studies.filter(study => {
            const matchesSearchTerm = study.studyTitle.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => study.studyKeywords?.includes(tag));

            let matchesDate = true;
            if (startDateFilter || endDateFilter) {
                try {
                    const studyStartDate = study.studyStarted ? new Date(study.studyStarted) : null;
                    const studyEndDate = study.studyEnded ? new Date(study.studyEnded) : (studyStartDate ? new Date(study.studyStarted) : null);
                    if (studyEndDate) studyEndDate.setHours(23, 59, 59, 999);

                    const filterStartDate = startDateFilter ? new Date(startDateFilter) : null;
                    if (filterStartDate) filterStartDate.setHours(0, 0, 0, 0);

                    const filterEndDate = endDateFilter ? new Date(endDateFilter) : null;
                    if (filterEndDate) filterEndDate.setHours(23, 59, 59, 999);

                    if (filterStartDate && studyStartDate && studyStartDate < filterStartDate) {
                        matchesDate = false;
                    }
                    const effectiveStudyEndDate = studyEndDate || studyStartDate;
                    if (filterEndDate && effectiveStudyEndDate && effectiveStudyEndDate > filterEndDate) {
                        if (studyStartDate && studyStartDate > filterEndDate) {
                            matchesDate = false;
                        }
                    }
                    if (filterStartDate && filterEndDate) {
                        matchesDate = !!((studyStartDate && studyStartDate <= filterEndDate) && (effectiveStudyEndDate && effectiveStudyEndDate >= filterStartDate));
                    } else if (filterStartDate) {
                        matchesDate = !!(effectiveStudyEndDate && effectiveStudyEndDate >= filterStartDate);
                    } else if (filterEndDate) {
                        matchesDate = !!(studyStartDate && studyStartDate <= filterEndDate);
                    }

                } catch (e) {
                    console.warn("Error parsing dates for filtering:", e);
                    matchesDate = true;
                }
            }
            return matchesSearchTerm && matchesTags && matchesDate;
        });
    }, [studies, searchTerm, selectedTags, startDateFilter, endDateFilter]);

    const studyCounts = useMemo(() => {
        if (!filteredStudies.length) return { total: 0, completed: 0, ongoing: 0, scheduled: 0 };

        let completed = 0;
        let ongoing = 0;
        let scheduled = 0;

        filteredStudies.forEach(study => {
            const { text } = getVisualStatus(study);
            if (text === 'Completed') completed++;
            else if (text === 'Ongoing') ongoing++;
            else if (text === 'Scheduled') scheduled++;
        });

        return {
            total: filteredStudies.length,
            completed,
            ongoing,
            scheduled
        };
    }, [filteredStudies]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh] fade-in">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium">Loading studies...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[80vh] px-4 fade-in">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading studies</h3>
                    <p className="text-red-600 mb-4">{error.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const filterPanelProps = {
        searchTerm,
        setSearchTerm,
        startDateFilter,
        setStartDateFilter,
        endDateFilter,
        setEndDateFilter,
        allTags,
        selectedTags,
        handleTagClick,
        clearFilters,
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px- fade-in">
            {/* Page header with stats */}
            <div className="max-w-[90%] mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Study Dashboard</h1>
                    <div className="flex flex-wrap gap-3">
                        <div className="badge bg-secondary text-secondary-foreground px-3 py-1.5">Total: {studyCounts.total}</div>
                        <div className="badge bg-green-100 text-green-700 px-3 py-1.5 flex items-center gap-1">
                            <FiCheckCircle className="w-3.5 h-3.5" />
                            <span>Completed: {studyCounts.completed}</span>
                        </div>
                        <div className="badge bg-yellow-100 text-yellow-700 px-3 py-1.5 flex items-center gap-1">
                            <FiClock className="w-3.5 h-3.5" />
                            <span>Ongoing: {studyCounts.ongoing}</span>
                        </div>
                        <div className="badge bg-blue-100 text-blue-700 px-3 py-1.5 flex items-center gap-1">
                            <FiCalendar className="w-3.5 h-3.5" />
                            <span>Scheduled: {studyCounts.scheduled}</span>
                        </div>
                    </div>
                </div>

                {/* Mobile search */}
                <div className="md:hidden mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search studies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-border bg-background rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                {/* Mobile filter toggle */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded-md text-sm font-medium bg-card hover:bg-secondary transition-colors"
                    >
                        <FiFilter className="h-4 w-4" />
                        {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
                        <span className="badge bg-primary text-primary-foreground ml-2 py-0.5">
                            {(!!searchTerm || selectedTags.length > 0 || !!startDateFilter || !!endDateFilter) ?
                                'Active' : 'None'}
                        </span>
                    </button>
                </div>
            </div>

            <div className="max-w-[90%] mx-auto flex flex-col md:flex-row gap-8">
                {/* Filters */}
                {showFiltersMobile && (
                    <div className="md:hidden mb-6">
                        <FilterPanel {...filterPanelProps} />
                    </div>
                )}
                <div className="hidden md:block">
                    <FilterPanel {...filterPanelProps} />
                </div>

                {/* Main content */}
                <main className="flex-1 space-y-6">
                    {/* View mode toggle and result count */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-muted-foreground text-sm">
                            Showing {filteredStudies.length} {filteredStudies.length === 1 ? 'study' : 'studies'}
                        </p>
                        <div className="flex items-center bg-secondary rounded-lg p-1">
                            <button
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                            >
                                <FiGrid className="w-4 h-4" />
                            </button>
                            <button
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                            >
                                <FiList className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {filteredStudies.length > 0 ? (
                        <div className={`${viewMode === 'grid' ?
                            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' :
                            'space-y-4'}`}
                        >
                            {filteredStudies.map((study: StudyResponse) => {
                                const { text: statusText, badgeClass, IconComponent } = getVisualStatus(study);
                                return (
                                    <StudyCard
                                        key={study._id}
                                        study={study}
                                        statusText={statusText}
                                        badgeClass={badgeClass}
                                        IconComponent={IconComponent}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <NoStudiesFound
                            clearFilters={clearFilters}
                            showClearFiltersButton={!!(searchTerm || selectedTags.length > 0 || startDateFilter || endDateFilter)}
                        />
                    )}
                </main>
            </div>
        </div>
    )
}

export default Page