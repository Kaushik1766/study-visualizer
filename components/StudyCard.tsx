'use client'

import React from 'react';
import { StudyResponse } from '@/types/StudyResponse';
import { FiMoreVertical, FiExternalLink, FiBarChart2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface StudyCardProps {
    study: StudyResponse;
    statusText: string;
    badgeClass: string;
    IconComponent: React.ElementType | null;
}

const StudyCard: React.FC<StudyCardProps> = ({
    study,
    statusText,
    badgeClass,
    IconComponent,
}) => {
    const router = useRouter();
    const createdDate = study.studyStarted ? new Date(study.studyStarted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : 'N/A';
    const endDate = study.studyEnded ? new Date(study.studyEnded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : 'Ongoing';

    const durationDays = study.studyStarted && study.studyEnded ?
        Math.ceil((new Date(study.studyEnded).getTime() - new Date(study.studyStarted).getTime()) / (1000 * 60 * 60 * 24)) :
        null;

    const handleCardClick = () => {
        router.push(`/study/${study._id}`);
    };

    return (
        <div className="card bg-card border border-border hover:border-primary/50 p-6 transition-all">
            <div className="flex flex-col justify-between h-full space-y-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-foreground/90 line-clamp-2">
                        {study.studyTitle}
                    </h3>
                    <div className="flex-shrink-0">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors">
                            <FiMoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`badge flex items-center ${badgeClass}`}>
                        {IconComponent && <IconComponent className="w-3.5 h-3.5 mr-1" />}
                        {statusText}
                    </span>
                    <span className="text-muted-foreground">{createdDate} – {endDate}</span>
                    {durationDays !== null && (
                        <span className="badge bg-secondary text-secondary-foreground flex items-center">
                            <FiBarChart2 className="w-3 h-3 mr-1" />
                            {durationDays} days
                        </span>
                    )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {"No description available for this study."}
                </p>

                {study.studyKeywords && study.studyKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {study.studyKeywords.slice(0, 3).map((keyword) => (
                            <span
                                key={keyword}
                                className="bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium"
                            >
                                {keyword}
                            </span>
                        ))}
                        {study.studyKeywords.length > 3 && (
                            <span className="bg-secondary/50 text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium">
                                +{study.studyKeywords.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="pt-2">
                    <button
                        onClick={handleCardClick}
                        className="btn btn-primary w-full text-sm flex items-center justify-center gap-2"
                    >
                        View Details
                        <FiExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyCard;
