import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading study details..." }) => {
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-gray-900">
            <FiLoader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-xl font-semibold">{message}</p>
        </div>
    );
};

export default LoadingState;
