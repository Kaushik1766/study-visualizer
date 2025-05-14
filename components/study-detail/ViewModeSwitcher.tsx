import React from 'react';
import { FiTable, FiBarChart2, FiMap } from 'react-icons/fi';

export type ActiveViewModeType = 'T' | 'B' | 'R';
export type DisplayPreferenceType = 'table' | 'chart' | 'heatmap';

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
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center bg-secondary/80 rounded-lg p-1">
                <button
                    onClick={() => onDisplayPreferenceChange('table')}
                    className={`p-2 rounded-md transition-colors ${activeDisplayPreference === 'table'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                    aria-pressed={activeDisplayPreference === 'table'}
                    title="Table View"
                >
                    <FiTable className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDisplayPreferenceChange('chart')}
                    className={`p-2 rounded-md transition-colors ${activeDisplayPreference === 'chart'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                    aria-pressed={activeDisplayPreference === 'chart'}
                    title="Bar Chart View"
                >
                    <FiBarChart2 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDisplayPreferenceChange('heatmap')}
                    className={`p-2 rounded-md transition-colors ${activeDisplayPreference === 'heatmap'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-foreground hover:bg-secondary'
                        }`}
                    aria-pressed={activeDisplayPreference === 'heatmap'}
                    title="Heat Map View"
                >
                    <FiMap className="w-5 h-5" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onViewModeChange('T')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'T' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                    Top Down
                </button>
                <button
                    onClick={() => onViewModeChange('B')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'B' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                    Bottom Up
                </button>
                <button
                    onClick={() => onViewModeChange('R')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeViewMode === 'R' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                    Response Time
                </button>
            </div>
        </div>
    );
};

export default ViewModeSwitcher;
