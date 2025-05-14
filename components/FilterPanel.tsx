'use client'

import React from 'react';
import { FiSearch, FiTag, FiX, FiFilter, FiCalendar, FiRefreshCw } from 'react-icons/fi';

interface FilterPanelProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    startDateFilter: string;
    setStartDateFilter: (date: string) => void;
    endDateFilter: string;
    setEndDateFilter: (date: string) => void;
    allTags: string[];
    selectedTags: string[];
    handleTagClick: (tag: string) => void;
    clearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
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
}) => {
    return (
        <div className="md:w-72 lg:w-80 xl:w-96 bg-card p-6 border border-border rounded-xl space-y-6 h-fit sticky top-24 shadow-sm transition-all fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FiFilter className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Filters</span>
                </h2>
                {(searchTerm || selectedTags.length > 0 || startDateFilter || endDateFilter) && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                        aria-label="Clear all filters"
                    >
                        <FiRefreshCw className="h-3.5 w-3.5" />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="search-study" className="text-sm font-medium">
                    Search by Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        name="search-study"
                        id="search-study"
                        className="block w-full pl-10 pr-3 py-2 text-sm border border-border bg-background rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Enter study name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm font-medium flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-primary" />
                    <span>Date Range</span>
                </p>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="start-date" className="block text-xs font-medium text-muted-foreground mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                            className="block w-full px-3 py-2 text-sm border border-border bg-background rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-xs font-medium text-muted-foreground mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                            min={startDateFilter}
                            className="block w-full px-3 py-2 text-sm border border-border bg-background rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <p className="text-sm font-medium flex items-center gap-2 mb-3">
                    <FiTag className="h-4 w-4 text-primary" />
                    <span>Tags</span>
                </p>
                {allTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center ${selectedTags.includes(tag)
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {selectedTags.includes(tag) ? (
                                    <FiX className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                ) : (
                                    <FiTag className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                )}
                                <span className="truncate" title={tag}>{tag}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No tags available.</p>
                )}
            </div>

            {(searchTerm || selectedTags.length > 0 || startDateFilter || endDateFilter) && (
                <button
                    onClick={clearFilters}
                    className="w-full mt-4 btn btn-primary group"
                >
                    <FiRefreshCw className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
