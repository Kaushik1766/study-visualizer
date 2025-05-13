'use client'

import React from 'react';
import { FiSearch, FiTag, FiX } from 'react-icons/fi';

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
        <div className="md:w-72 lg:w-80 xl:w-96 bg-white p-6 shadow-lg rounded-xl space-y-6 h-fit sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filters</h2>

            <div>
                <label htmlFor="search-study" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Search by Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        name="search-study"
                        id="search-study"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm text-gray-900"
                        placeholder="Enter study name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <p className="block text-sm font-medium text-gray-700">Filter by Date</p>
                <div>
                    <label htmlFor="start-date" className="block text-xs font-medium text-gray-600 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="start-date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm text-gray-900"
                    />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-xs font-medium text-gray-600 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="end-date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        min={startDateFilter}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-3 py-2 sm:text-sm border-gray-300 rounded-md shadow-sm text-gray-900"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Tags
                </label>
                {allTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ease-in-out flex items-center 
                                    ${selectedTags.includes(tag)
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                <FiTag className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                <span className="truncate" title={tag}>{tag}</span>
                                {selectedTags.includes(tag) && <FiX className="w-3 h-3 ml-1.5 flex-shrink-0" />}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No tags available.</p>
                )}
            </div>

            {(searchTerm || selectedTags.length > 0 || startDateFilter || endDateFilter) && (
                <button
                    onClick={clearFilters}
                    className="w-full mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
