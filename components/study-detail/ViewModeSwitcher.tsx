import React from 'react';
import { FiTable, FiBarChart2, FiMap } from 'react-icons/fi';

export type ActiveViewModeType = 'T' | 'B' | 'R';
export type DisplayPreferenceType = 'table' | 'chart' | 'heatmap'; // Updated to include heatmap

interface ViewModeSwitcherProps {
    activeViewMode: ActiveViewModeType;
    onViewModeChange: (mode: ActiveViewModeType) => void;
    activeDisplayPreference: DisplayPreferenceType;
    onDisplayPreferenceChange: (preference: DisplayPreferenceType) => void;
}

const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({
    activeViewMode,
    onViewModeChange,
    activeDisplayPreference,
    onDisplayPreferenceChange
}) => {
    return (
        <div className="mb-6 bg-white shadow-md rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
                <button
                    onClick={() => onDisplayPreferenceChange('table')}
                    className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${activeDisplayPreference === 'table' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    aria-pressed={activeDisplayPreference === 'table'}
                    title="Table View"
                >
                    <FiTable />
                </button>
                <button
                    onClick={() => onDisplayPreferenceChange('chart')}
                    className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${activeDisplayPreference === 'chart' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    aria-pressed={activeDisplayPreference === 'chart'}
                    title="Bar Chart View"
                >
                    <FiBarChart2 />
                </button>
                <button
                    onClick={() => onDisplayPreferenceChange('heatmap')}
                    className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${activeDisplayPreference === 'heatmap' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    aria-pressed={activeDisplayPreference === 'heatmap'}
                    title="Heat Map View"
                >
                    <FiMap />
                </button>
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
