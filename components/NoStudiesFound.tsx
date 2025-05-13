'use client'

import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface NoStudiesFoundProps {
    clearFilters: () => void;
    showClearFiltersButton: boolean;
}

const NoStudiesFound: React.FC<NoStudiesFoundProps> = ({ clearFilters, showClearFiltersButton }) => {
    return (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FiSearch className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">No studies found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria, or clear all filters.</p>
            {showClearFiltersButton && (
                <button
                    onClick={clearFilters}
                    className="mt-6 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default NoStudiesFound;
