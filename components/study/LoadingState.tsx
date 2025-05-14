import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading study details..." }) => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center fade-in">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-semibold">{message}</p>
        </div>
    );
};

export default LoadingState;
