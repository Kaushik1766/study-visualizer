import React from 'react';

interface SegmentTabsProps {
    segments: Array<{
        key: string;
        name: string;
        parentKey: string;
        isMindsetSubTab: boolean;
    }>;
    activeSegmentKey: string | null;
    onSegmentChange: (key: string) => void;
}

const SegmentTabs: React.FC<SegmentTabsProps> = ({ segments, activeSegmentKey, onSegmentChange }) => {
    if (!segments || segments.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-4 bg-card border-b border-border">
                No segments available for this view mode.
            </div>
        );
    }

    return (
        <div className="px-1">
            <nav className="flex overflow-x-auto" aria-label="Segment tabs">
                {segments.map((segment) => (
                    <button
                        key={segment.key}
                        onClick={() => onSegmentChange(segment.key)}
                        className={`whitespace-nowrap py-3 px-4 font-medium text-sm transition-colors border-b-2 
                            ${activeSegmentKey === segment.key
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            }`}
                    >
                        {segment.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default SegmentTabs;
