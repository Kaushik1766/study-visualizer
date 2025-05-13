'use client'

import React from 'react';
import { StudyResponse } from '@/types/StudyResponse';
import { FiMoreVertical } from 'react-icons/fi';

interface StudyCardProps {
    study: StudyResponse;
    onSelectStudy: (study: StudyResponse) => void;
    statusText: string;
    badgeClass: string;
    IconComponent: React.ElementType | null;
}

const StudyCard: React.FC<StudyCardProps> = ({
    study,
    onSelectStudy,
    statusText,
    badgeClass,
    IconComponent,
}) => {
    const createdDate = study.studyStarted ? new Date(study.studyStarted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : 'N/A';

    return (
        <div
            key={study._id}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.015]"
            onClick={() => onSelectStudy(study)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1.5 group-hover:text-indigo-600 transition-colors">
                        {study.studyTitle}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs text-gray-500 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${badgeClass} mb-1 sm:mb-0`}>
                            {IconComponent && <IconComponent className="w-3.5 h-3.5 mr-1.5" />}
                            {statusText}
                        </span>
                        <span className="hidden sm:inline text-gray-400">•</span>
                        <span className="text-gray-600">Created: {createdDate}</span>
                    </div>
                    {study.studyKeywords && study.studyKeywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {study.studyKeywords.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                        <FiMoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyCard;
