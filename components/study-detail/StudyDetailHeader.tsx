import React from 'react';
import { FiFileText, FiClipboard, FiArrowLeft, FiCalendar, FiUsers } from 'react-icons/fi';
import { StudyResponse } from '@/types/StudyResponse';

interface StudyDetailHeaderProps {
    study: StudyResponse;
    overallBaseSize: number;
    formatDate: (dateString: string | null | undefined) => string;
    onBack: () => void;
}

const StudyDetailHeader: React.FC<StudyDetailHeaderProps> = ({ study, overallBaseSize, formatDate, onBack }) => {
    return (
        <>
            <button
                onClick={onBack}
                className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors group"
            >
                <FiArrowLeft className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-400" />
                Back to Studies
            </button>
            <header className="mb-6 bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{study.studyTitle}</h1>
                        <div className="flex flex-wrap text-sm text-muted-foreground gap-x-6 gap-y-2">
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
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button className="btn btn-secondary inline-flex items-center gap-2">
                            <FiFileText className="w-4 h-4 text-red-500" /> Export PDF
                        </button>
                        <button className="btn btn-secondary inline-flex items-center gap-2">
                            <FiClipboard className="w-4 h-4 text-blue-500" /> Export PPTX
                        </button>
                    </div>
                </div>

                {study.studyObjective && (
                    <div className="mt-4 bg-secondary/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-1">Study Objective</h3>
                        <p className="text-sm text-muted-foreground">{study.studyObjective}</p>
                    </div>
                )}
            </header>
        </>
    );
};

export default StudyDetailHeader;
