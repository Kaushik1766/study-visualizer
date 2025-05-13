import React from 'react';
import { FiTable, FiBarChart2, FiPieChart } from 'react-icons/fi';

export type ActiveViewModeType = 'T' | 'B' | 'R';

interface ViewModeSwitcherProps {
    activeViewMode: ActiveViewModeType;
    onViewModeChange: (mode: ActiveViewModeType) => void;
}

const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({ activeViewMode, onViewModeChange }) => {
    return (
        <div className="mb-6 bg-white shadow-md rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
                {/* Placeholder for actual chart/table view switchers */}
                <button className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"><FiTable /></button>
                <button className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"><FiBarChart2 /></button>
                <button className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"><FiPieChart /></button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onViewModeChange('T')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'T' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Top Down
                </button>
                <button
                    onClick={() => onViewModeChange('B')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'B' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Bottom Up
                </button>
                <button
                    onClick={() => onViewModeChange('R')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'R' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    Response Time
                </button>
            </div>
        </div>
    );
};

export default ViewModeSwitcher;
