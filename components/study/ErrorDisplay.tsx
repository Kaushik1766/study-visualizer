import React from 'react';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

interface ErrorDisplayProps {
    errorMessage: string;
    onRetry?: () => void;
    showBackButton?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry, showBackButton = true }) => {
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-red-600">
            <FiAlertTriangle className="w-12 h-12 mb-4" />
            <p className="text-xl font-semibold text-center">Error: {errorMessage}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Try Again
                </button>
            )}
            {showBackButton && (
                <button onClick={() => window.history.back()} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <FiArrowLeft className="w-5 h-5 mr-2" /> Go Back
                </button>
            )}
        </div>
    );
};

export default ErrorDisplay;
