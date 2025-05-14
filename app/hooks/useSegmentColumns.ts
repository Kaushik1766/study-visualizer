'use client';

import { useMemo } from 'react';
import { Segment, StudyResponse } from '@/types/StudyResponse';
import { ActiveViewModeType, SegmentConfig, SegmentColumn } from '@/app/hooks/useSegmentData';
import { getSegmentDisplayName } from '@/app/utils/segmentUtils';

export function useSegmentColumns(
    activeSegmentKey: string | null,
    activeSegmentData: Segment | undefined,
    activeSegmentConfig: SegmentConfig | null,
    study: StudyResponse | null,
    activeViewMode: ActiveViewModeType,
    displayableSegments: SegmentConfig[]
) {
    const marketSegmentColumns = useMemo(() => {
        if (!activeSegmentConfig || !activeSegmentData?.["Base Values"]) {
            return [];
        }

        const parentBaseValues = activeSegmentData["Base Values"];
        const currentTabName = activeSegmentConfig.name;

        if (activeSegmentConfig.isMindsetSubTab && getSegmentDisplayName(activeSegmentConfig.parentKey) === 'Market Segments') {
            const match = currentTabName.match(/Mindset (\d+) of (\d+)/);
            if (match) {
                const seriesMax = match[2]; // "2" or "3" from "Mindset X of Y"
                const relevantMindsetKeys = Object.keys(parentBaseValues)
                    .filter(key => {
                        const keyMatch = key.match(/Mindset (\d+) of (\d+)/);
                        return keyMatch && keyMatch[2] === seriesMax && parentBaseValues[key] !== null;
                    });

                return relevantMindsetKeys.map(key => ({
                    header: key,
                    count: parentBaseValues[key] as number || 0
                })).sort((a, b) => a.header.localeCompare(b.header));
            }
            // Fallback for a mindset sub-tab that doesn't match the pattern
            const count = parentBaseValues[currentTabName];
            if (count !== undefined && count !== null) {
                return [{ header: currentTabName, count: count as number || 0 }];
            }
            return [];
        } else if (currentTabName === 'Market Segments' && activeSegmentConfig.parentKey === activeSegmentConfig.key) {
            return Object.entries(parentBaseValues)
                .filter(([key, value]) => value !== null && key.startsWith("Mindset"))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }))
                .sort((a, b) => a.header.localeCompare(b.header));
        }

        return [];
    }, [activeSegmentConfig, activeSegmentData]);

    const ageDemographicColumns = useMemo(() => {
        if (!activeSegmentKey || !activeSegmentData?.["Base Values"] || !displayableSegments) return [];
        const currentSegmentConfig = displayableSegments.find(s => s.key === activeSegmentKey);
        const dataKeyForName = currentSegmentConfig?.parentKey;
        const segmentName = dataKeyForName ? getSegmentDisplayName(dataKeyForName) : "";

        if (segmentName === 'Age' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => value !== null && !key.startsWith("Unnamed:") && /\d+(?: - \d+)?\+?/.test(key))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }));
        }
        return [];
    }, [activeSegmentKey, activeSegmentData, displayableSegments]);

    const prelimSpecificAgeColumns = useMemo(() => {
        if (!activeSegmentKey || !study?.studyData || !displayableSegments) return [];
        const currentSegmentConfig = displayableSegments.find(s => s.key === activeSegmentKey);
        const dataKeyForName = currentSegmentConfig?.parentKey;
        const currentSegmentDisplayName = dataKeyForName ? getSegmentDisplayName(dataKeyForName) : "";

        if (currentSegmentDisplayName === 'Prelim' && study?.studyData) {
            const ageSegmentKeyForViewMode = Object.keys(study.studyData).find(key =>
                key.startsWith(`(${activeViewMode})`) && getSegmentDisplayName(key) === 'Age'
            );
            if (ageSegmentKeyForViewMode && study.studyData[ageSegmentKeyForViewMode]?.["Base Values"]) {
                return Object.entries(study.studyData[ageSegmentKeyForViewMode]["Base Values"])
                    .filter(([key, value]) => value !== null && !key.startsWith("Unnamed:") && /\d+(?: - \d+)?\+?/.test(key))
                    .map(([key, value]) => ({ header: key, count: value as number || 0 }));
            }
        }
        return [];
    }, [activeSegmentKey, study?.studyData, activeViewMode, displayableSegments]);

    const prelimColumns = useMemo(() => {
        if (!activeSegmentKey || !activeSegmentData?.["Base Values"] || !displayableSegments) return [];
        const currentSegmentConfig = displayableSegments.find(s => s.key === activeSegmentKey);
        const dataKeyForName = currentSegmentConfig?.parentKey;
        const segmentName = dataKeyForName ? getSegmentDisplayName(dataKeyForName) : "";

        if (segmentName === 'Prelim' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => value !== null && !key.startsWith("Unnamed:"))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }));
        }
        return [];
    }, [activeSegmentKey, activeSegmentData, displayableSegments]);

    const genderDemographicColumns = useMemo(() => {
        if (!activeSegmentKey || !activeSegmentData?.["Base Values"] || !displayableSegments) return [];
        const currentSegmentConfig = displayableSegments.find(s => s.key === activeSegmentKey);
        const dataKeyForName = currentSegmentConfig?.parentKey;
        const segmentName = dataKeyForName ? getSegmentDisplayName(dataKeyForName) : "";

        if (segmentName === 'Gender' && activeSegmentData?.["Base Values"]) {
            return Object.entries(activeSegmentData["Base Values"])
                .filter(([key, value]) => (key.toLowerCase() === 'male' || key.toLowerCase() === 'female') && value !== null && !key.startsWith("Unnamed:"))
                .map(([key, value]) => ({ header: key, count: value as number || 0 }));
        }
        return [];
    }, [activeSegmentKey, activeSegmentData, displayableSegments]);

    return {
        marketSegmentColumns,
        ageDemographicColumns,
        prelimSpecificAgeColumns,
        prelimColumns,
        genderDemographicColumns
    };
}