import Link from 'next/link';
import React from 'react';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';

interface StudyNotFoundProps {
    studyId?: string;
}

const StudyNotFound: React.FC<StudyNotFoundProps> = ({ studyId }) => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 fade-in">
            <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSearch className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Study Not Found</h1>
                {studyId && (
                    <p className="text-muted-foreground mb-6">
                        We couldn't find the study with ID: <span className="font-mono bg-secondary px-2 py-0.5 rounded">{studyId}</span>
                    </p>
                )}
                {!studyId && (
                    <p className="text-muted-foreground mb-6">
                        The requested study could not be found.
                    </p>
                )}
                <Link
                    href="/"
                    className="btn btn-primary inline-flex items-center gap-2"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Studies
                </Link>
            </div>
        </div>
    );
};

export default StudyNotFound;
