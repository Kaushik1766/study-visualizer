'use client';

import { useMemo, useState, useEffect } from 'react';
import { StudyResponse, Segment } from '@/types/StudyResponse';
import { getSegmentDisplayName } from '@/app/utils/segmentUtils';

export type ActiveViewModeType = 'B' | 'T' | 'R';
export type DisplayPreferenceType = 'table' | 'chart' | 'heatmap';

export type SegmentConfig = {
    key: string;
    name: string;
    parentKey: string;
    isMindsetSubTab: boolean;
};

export type SegmentColumn = {
    header: string;
    count: number;
};

export function useSegmentData(
    study: StudyResponse | null,
    activeViewMode: ActiveViewModeType
) {
    const [activeSegmentKey, setActiveSegmentKey] = useState<string | null>(null);
    const [targetSegmentName, setTargetSegmentName] = useState<string | null>(null);

    const displayableSegments = useMemo(() => {
        if (!study?.studyData) return [];
        const newSegments: Array<SegmentConfig> = [];

        Object.keys(study.studyData).forEach(key => {
            if (key.startsWith(`(${activeViewMode})`)) {
                const segmentDisplayName = getSegmentDisplayName(key);

                if (segmentDisplayName === "Market Segments") {
                    const mindsetsData = study.studyData[key];
                    if (mindsetsData?.["Base Values"]) {
                        const mindset1of2 = mindsetsData["Base Values"]["Mindset 1 of 2"];
                        const mindset1of3 = mindsetsData["Base Values"]["Mindset 1 of 3"];

                        if (mindset1of2 !== undefined && mindset1of2 !== null) {
                            newSegments.push({
                                key: `${key}_Mindset 1 of 2`,
                                name: "Mindset 1 of 2",
                                parentKey: key,
                                isMindsetSubTab: true,
                            });
                        }
                        if (mindset1of3 !== undefined && mindset1of3 !== null) {
                            newSegments.push({
                                key: `${key}_Mindset 1 of 3`,
                                name: "Mindset 1 of 3",
                                parentKey: key,
                                isMindsetSubTab: true,
                            });
                        }
                    }
                } else if (segmentDisplayName !== "Combined") {
                    newSegments.push({
                        key,
                        name: segmentDisplayName,
                        parentKey: key,
                        isMindsetSubTab: false,
                    });
                }
            }
        });

        return newSegments.sort((a, b) => {
            if (a.name === "Overall") return -1;
            if (b.name === "Overall") return 1;
            if (a.isMindsetSubTab && !b.isMindsetSubTab) return -1;
            if (!a.isMindsetSubTab && b.isMindsetSubTab) return 1;
            if (a.isMindsetSubTab && b.isMindsetSubTab) {
                return a.name.localeCompare(b.name);
            }
            return a.name.localeCompare(b.name);
        });
    }, [study?.studyData, activeViewMode]);

    const activeSegmentData: Segment | undefined = useMemo(() => {
        if (!study || !activeSegmentKey || !displayableSegments) return undefined;
        const currentSegmentConfig = displayableSegments.find(s => s.key === activeSegmentKey);
        const dataKey = currentSegmentConfig?.parentKey; // Always use parentKey from config
        if (!dataKey) return undefined;
        return study.studyData[dataKey];
    }, [study, activeSegmentKey, displayableSegments]);

    const activeSegmentConfig = useMemo(() => {
        if (!activeSegmentKey || !displayableSegments) return null;
        return displayableSegments.find(s => s.key === activeSegmentKey) || null;
    }, [activeSegmentKey, displayableSegments]);

    const overallBaseSize = useMemo(() => {
        if (!study) return 0;
        const overallKey = `(${activeViewMode}) Overall` as keyof typeof study.studyData;
        const baseSizeFromOverall = study.studyData[overallKey]?.Data?.['Base Size'];
        return baseSizeFromOverall ?? study.studyRespondents ?? 0;
    }, [study, activeViewMode]);

    useEffect(() => {
        if (displayableSegments.length > 0) {
            let keySetFromTarget = false;
            if (targetSegmentName) {
                const targetInNewSegments = displayableSegments.find(s => s.name === targetSegmentName);
                if (targetInNewSegments) {
                    setActiveSegmentKey(targetInNewSegments.key);
                    keySetFromTarget = true;
                }
                setTargetSegmentName(null); // Consume the target name
            }

            if (!keySetFromTarget) {
                // This block now handles initial load, or if targetSegmentName didn't match,
                // or if activeSegmentKey is invalid for current segments for other reasons.
                const currentSegmentStillValid = activeSegmentKey && displayableSegments.some(s => s.key === activeSegmentKey);
                if (!currentSegmentStillValid) {
                    const overallSegment = displayableSegments.find(s => s.name === "Overall");
                    if (overallSegment) {
                        setActiveSegmentKey(overallSegment.key);
                    } else if (displayableSegments.length > 0) {
                        // Default to the first segment if "Overall" is not found
                        setActiveSegmentKey(displayableSegments[0].key);
                    } else {
                        // This case should ideally not be reached if displayableSegments.length > 0
                        setActiveSegmentKey(null);
                    }
                }
            }
        } else {
            // No displayable segments, so no active key
            setActiveSegmentKey(null);
            if (targetSegmentName) { // Clear target if no segments available
                setTargetSegmentName(null);
            }
        }
    }, [displayableSegments, targetSegmentName, activeSegmentKey]);

    const handleViewModeChange = (mode: ActiveViewModeType) => {
        if (activeSegmentKey) {
            // Find the name of the current segment from the current displayableSegments list
            const currentActiveSegmentInfo = displayableSegments.find(s => s.key === activeSegmentKey);
            if (currentActiveSegmentInfo) {
                setTargetSegmentName(currentActiveSegmentInfo.name);
            } else {
                // Fallback if current activeSegmentKey isn't found (should be rare)
                setTargetSegmentName("Overall");
            }
        } else {
            // If no segment is currently active, target "Overall" by default for the new view
            setTargetSegmentName("Overall");
        }
        return mode;
    };

    return {
        displayableSegments,
        activeSegmentKey,
        setActiveSegmentKey,
        activeSegmentData,
        activeSegmentConfig,
        overallBaseSize,
        handleViewModeChange
    };
}