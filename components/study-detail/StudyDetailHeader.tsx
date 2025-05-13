import React from 'react';
import { FiFileText, FiClipboard, FiArrowLeft } from 'react-icons/fi';
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
            <header className="mb-6 bg-white shadow-lg rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{study.studyTitle}</h1>
                        <div className="flex flex-wrap text-sm text-gray-600 gap-x-4 gap-y-1">
                            <span>Status: <span className="font-semibold text-gray-700">{study.studyStatus ? (study.studyStatus.toLowerCase().includes('completed') || study.studyStatus.includes('/') ? `Completed on: ${formatDate(study.studyStatus)}` : study.studyStatus) : 'N/A'}</span></span>
                            <span>Surveys Started: <span className="font-semibold text-gray-700">{formatDate(study.studyStarted)}</span></span>
                            <span>Surveys Completed: <span className="font-semibold text-gray-700">{study.studyRespondents} (out of {overallBaseSize})</span></span>
                        </div>
                        {study.studyKeywords && study.studyKeywords.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {study.studyKeywords.map((keyword) => (
                                    <span key={keyword} className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                            <FiFileText className="w-4 h-4 mr-2 text-red-500" /> Export PDF
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                            <FiClipboard className="w-4 h-4 mr-2 text-blue-500" /> Export PPTX
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default StudyDetailHeader;
