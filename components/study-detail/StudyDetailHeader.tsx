import React from 'react';
import { FiCalendar, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { StudyResponse } from '@/types/StudyResponse';

interface StudyDetailHeaderProps {
    study: StudyResponse;
    overallBaseSize: number;
    formatDate: (dateString: string | null | undefined) => string;
    onBack: () => void;
    studyObjective?: string;
}

const StudyDetailHeader: React.FC<StudyDetailHeaderProps> = ({
    study,
    overallBaseSize,
    formatDate,
    onBack,
    studyObjective
}) => {
    return (
        <>
            {/* <button
                onClick={onBack}
                className="mb-6 inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors group"
            >
                <FiArrowLeft className="w-5 h-5 mr-2 text-primary group-hover:text-primary/80" />
                Back to Studies
            </button> */}
            <header className="mb-6 bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{study.studyTitle}</h1>
                        <div className="flex flex-wrap text-sm text-foreground gap-x-6 gap-y-2">
                            <div className="flex items-center">
                                <FiCalendar className="w-4 h-4 mr-2 text-primary" />
                                <span>
                                    {study.studyStatus ?
                                        (study.studyStatus.toLowerCase().includes('completed') ||
                                            study.studyStatus.includes('/') ?
                                            `Completed on: ${formatDate(study.studyStatus)}` :
                                            study.studyStatus) :
                                        'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="w-4 h-4 mr-2 text-primary" />
                                <span>Started: {formatDate(study.studyStarted)}</span>
                            </div>
                            <div className="flex items-center">
                                <FiUsers className="w-4 h-4 mr-2 text-primary" />
                                <span>Respondents: {study.studyRespondents} / {overallBaseSize}</span>
                            </div>
                        </div>
                        {study.studyKeywords && study.studyKeywords.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {study.studyKeywords.map((keyword) => (
                                    <span key={keyword} className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {studyObjective && (
                    <div className="mt-4 bg-secondary/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-1">Study Objective</h3>
                        <p className="text-sm text-foreground">{studyObjective}</p>
                    </div>
                )}
            </header>
        </>
    );
};

export default StudyDetailHeader;
