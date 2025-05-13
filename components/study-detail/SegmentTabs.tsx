import React from 'react';

interface SegmentTabsProps {
    segments: { key: string; name: string }[];
    activeSegmentKey: string | null;
    onSegmentChange: (key: string) => void;
}

const SegmentTabs: React.FC<SegmentTabsProps> = ({ segments, activeSegmentKey, onSegmentChange }) => {
    if (!segments || segments.length === 0) {
        return <p className="text-center text-gray-500 py-4">No segments available for this view mode.</p>;
    }

    return (
        <div className="mb-1">
            <div className="border-b border-gray-300">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {segments.map((segment) => (
                        <button
                            key={segment.key}
                            onClick={() => onSegmentChange(segment.key)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeSegmentKey === segment.key
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {segment.name}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default SegmentTabs;
