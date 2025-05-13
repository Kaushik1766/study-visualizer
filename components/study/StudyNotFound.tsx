import React from 'react';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

interface StudyNotFoundProps {
    studyId?: string;
}

const StudyNotFound: React.FC<StudyNotFoundProps> = ({ studyId }) => {
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
            <div className="max-w-4xl mx-auto text-center">
                <FiAlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Study Not Found</h1>
                {studyId && <p className="text-gray-600 mb-8">Sorry, we couldn't find the study with ID: {studyId}.</p>}
                {!studyId && <p className="text-gray-600 mb-8">Sorry, the requested study could not be found.</p>}
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Studies
                </button>
            </div>
        </div>
    );
};

export default StudyNotFound;
