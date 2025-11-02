
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SystemIcon } from './icons/SystemIcon';

interface NavbarProps {
    onProfileClick: () => void;
    isScannerActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onProfileClick, isScannerActive }) => {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useI18n();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    const cycleTheme = () => {
        const themes = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex] as 'light' | 'dark' | 'system');
    };

    const ThemeIcon = () => {
        if (theme === 'light') return <SunIcon className="h-6 w-6" />;
        if (theme === 'dark') return <MoonIcon className="h-6 w-6" />;
        return <SystemIcon className="h-6 w-6" />;
    };

    if (isScannerActive) {
        return null; // Don't show navbar on scanner screen
    }

    return (
        <header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-transparent">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('appName')}</h1>
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={toggleLanguage}
                    className="px-3 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
                >
                    {language === 'en' ? 'HI' : 'EN'}
                </button>

                <button
                    onClick={cycleTheme}
                    className="p-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label={`Switch theme to ${theme}`}
                >
                    <ThemeIcon />
                </button>
                
                <button 
                    onClick={onProfileClick} 
                    className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow"
                >
                    {t('myProfile')}
                </button>
            </div>
        </header>
    );
};
