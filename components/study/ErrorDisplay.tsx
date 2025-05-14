import React from 'react';
import { FiAlertTriangle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

interface ErrorDisplayProps {
    errorMessage: string;
    onRetry?: () => void;
    showBackButton?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry, showBackButton = true }) => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center fade-in">
            <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">{errorMessage}</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="btn btn-primary inline-flex items-center gap-2"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    )}
                    {showBackButton && (
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-secondary inline-flex items-center gap-2"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
