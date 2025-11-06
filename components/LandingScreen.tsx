import React from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { CameraIcon } from './icons/CameraIcon';

interface LandingScreenProps {
    onGetStarted: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
    const { t } = useTranslations();

    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 md:p-8 text-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="max-w-3xl w-full">
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <CameraIcon className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="mt-6 text-4xl md:text-6xl font-bold text-green-600 dark:text-green-400">
                    {t.landingTitle}
                </h1>
                <p className="mt-4 text-lg md:text-2xl text-gray-600 dark:text-gray-300">
                    {t.landingSubtitle}
                </p>
                <p className="mt-4 max-w-xl mx-auto text-md md:text-lg text-gray-500 dark:text-gray-400">
                    {t.landingDescription}
                </p>

                <div className="mt-12">
                    <button
                        onClick={onGetStarted}
                        className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
                    >
                        {t.getStarted}
                    </button>
                </div>
            </div>
        </div>
    );
};
