'use client'

import React from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

interface NoStudiesFoundProps {
    clearFilters: () => void;
    showClearFiltersButton: boolean;
}

const NoStudiesFound: React.FC<NoStudiesFoundProps> = ({ clearFilters, showClearFiltersButton }) => {
    return (
        <div className="text-center py-16 bg-card border border-border rounded-xl fade-in">
            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                <FiSearch className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No studies found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            {showClearFiltersButton && (
                <button
                    onClick={clearFilters}
                    className="mt-6 btn btn-primary inline-flex items-center gap-2"
                >
                    <FiRefreshCw className="w-4 h-4" />
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default NoStudiesFound;
