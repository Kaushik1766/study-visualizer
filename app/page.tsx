'use client'
import { StudyResponse } from '@/types/StudyResponse'
import React, { useState, useMemo } from 'react'
import { useStudies } from './hooks/useStudies'
import { FiCheckCircle, FiClock, FiCalendar, FiFilter } from 'react-icons/fi'
import FilterPanel from '@/components/FilterPanel'
import StudyCard from '@/components/StudyCard'
import NoStudiesFound from '@/components/NoStudiesFound'

const getVisualStatus = (study: StudyResponse) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let statusText = study.studyStatus;
    let badgeClass = 'bg-gray-200 text-gray-700';
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
                badgeClass = 'bg-gray-100 text-gray-600';
            }
        } catch (e) {
            console.warn("Error parsing study dates for status determination:", e);
            statusText = study.studyStatus;
            badgeClass = 'bg-gray-100 text-gray-600';
        }
    }
    return { text: statusText, badgeClass, IconComponent };
};

function Page() {
    const [selectedStudyForModal, setSelectedStudyForModal] = useState<StudyResponse | null>(null)
    const { data: studies, error, isLoading } = useStudies()
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

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

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen text-xl font-semibold bg-gray-100">Loading studies...</div>
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500 text-xl bg-gray-100 p-4">Error fetching studies: {error.message}</div>
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
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <header className="max-w-7xl mx-auto mb-10 px-4 md:px-0">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Studies</h1>
            </header>

            <div className="md:hidden mb-6 px-4">
                <button
                    onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    <FiFilter className="h-5 w-5 mr-2" />
                    {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {showFiltersMobile && (
                    <div className="md:hidden mb-6">
                        <FilterPanel {...filterPanelProps} />
                    </div>
                )}
                <div className="hidden md:block">
                    <FilterPanel {...filterPanelProps} />
                </div>

                <main className="flex-1">
                    {filteredStudies.length > 0 ? (
                        <div className="space-y-6">
                            {filteredStudies.map((study: StudyResponse) => {
                                const { text: statusText, badgeClass, IconComponent } = getVisualStatus(study);
                                return (
                                    <StudyCard
                                        key={study._id}
                                        study={study}
                                        onSelectStudy={setSelectedStudyForModal}
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