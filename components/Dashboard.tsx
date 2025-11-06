import React, { useState, useCallback, useEffect } from 'react';
import { HomeScreen } from './HomeScreen';
import { Scanner } from './Scanner';
import { ResultsDisplay } from './ResultsDisplay';
import { ProfileModal } from './ProfileModal';
import { View, ScanMode, UserProfile, AnalysisResult, NutritionalInfo, Gender, DietType, HealthCondition } from '../types';
import { analyzeFoodFromImage, analyzeFoodFromQR, getHealthRecommendation, translateAnalysisResult } from '../services/geminiService';
import { useTranslations } from '../contexts/LanguageContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { LanguageIcon } from './icons/LanguageIcon';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
  
const defaultProfile: UserProfile = {
    uid: 'local-user',
    email: 'guest@nutriscan.ai',
    displayName: 'Guest User',
    age: 30, // Default age
    gender: Gender.PREFER_NOT_TO_SAY,
    dietType: DietType.NONE,
    healthCondition: HealthCondition.NONE,
    allergies: [],
};

const getInitialProfile = (): UserProfile => {
    try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            return JSON.parse(savedProfile);
        }
    } catch (error) {
        console.error("Failed to parse user profile from localStorage", error);
    }
    // If nothing in localStorage, save and return the default profile
    localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    return defaultProfile;
};


export const Dashboard: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [scanMode, setScanMode] = useState<ScanMode>(ScanMode.IMAGE);
  const [userProfile, setUserProfile] = useState<UserProfile>(getInitialProfile);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [originalResult, setOriginalResult] = useState<AnalysisResult | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { t, setLanguage, language } = useTranslations();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      return theme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleProfileSave = async (updatedProfile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
  };

  const handleAnalysis = useCallback(async (getNutritionalInfo: () => Promise<NutritionalInfo>) => {
    setIsLoading(true);
    setError(null);
    try {
      const nutritionalInfo = await getNutritionalInfo();
      const recommendation = await getHealthRecommendation(nutritionalInfo, userProfile);
      const result = { ...recommendation, nutritionalInfo };
      setOriginalResult(result);
      setView(View.RESULTS);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setView(View.HOME);
      setIsLoading(false); // Ensure loading is stopped on error
    }
  }, [userProfile]);
  
  useEffect(() => {
    const processResult = async () => {
      if (view === View.RESULTS && originalResult) {
        setIsLoading(true);
        setError(null);
        try {
          if (language === 'hi') {
            const translated = await translateAnalysisResult(originalResult, 'Hindi');
            setAnalysisResult(translated);
          } else {
            setAnalysisResult(originalResult);
          }
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An error occurred during translation.';
          setError(errorMessage);
          setAnalysisResult(originalResult); // Fallback to original
        } finally {
          setIsLoading(false);
        }
      }
    };
    processResult();
  }, [language, originalResult, view]);

  const handleImageCapture = useCallback((imageSrc: string) => {
    setScannedImage(imageSrc);
    const base64Image = imageSrc.split(',')[1];
    handleAnalysis(() => analyzeFoodFromImage(base64Image, 'image/jpeg'));
  }, [handleAnalysis]);
  
  const handleImageUpload = useCallback(async (file: File) => {
    try {
        const base64Image = await fileToBase64(file);
        const imageSrc = URL.createObjectURL(file);
        setScannedImage(imageSrc);
        await handleAnalysis(() => analyzeFoodFromImage(base64Image, file.type));
    } catch (e) {
        console.error("Error processing file upload:", e);
        const errorMessage = e instanceof Error ? e.message : 'There was an error reading the file.';
        setError(errorMessage);
        setIsLoading(false); 
        setView(View.HOME);
    }
  }, [handleAnalysis]);

  const handleQrCodeScan = useCallback((data: string) => {
    setScannedImage(null);
    handleAnalysis(() => analyzeFoodFromQR(data));
  }, [handleAnalysis]);

  const handleModeSelect = (mode: ScanMode) => {
    setScanMode(mode);
    setView(View.SCANNING);
  };

  const resetApp = () => {
    setView(View.HOME);
    setAnalysisResult(null);
    setOriginalResult(null);
    setScannedImage(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
          <p className="mt-4 text-xl">{t.analyzing}</p>
        </div>
      );
    }

    switch (view) {
      case View.SCANNING:
        return (
          <Scanner
            mode={scanMode}
            onImageCapture={handleImageCapture}
            onQrCodeScan={handleQrCodeScan}
            onBack={resetApp}
          />
        );
      case View.RESULTS:
        return <ResultsDisplay result={analysisResult} scannedImage={scannedImage} onReset={resetApp} />;
      case View.HOME:
      default:
        return <HomeScreen onModeSelect={handleModeSelect} onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="h-screen w-screen font-sans bg-gray-50 dark:bg-gray-900 antialiased flex flex-col">
       <header className={`p-4 flex justify-between items-center ${view === View.SCANNING ? 'hidden' : ''} bg-gray-50 dark:bg-gray-900`}>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t.nutriScanAI}</h1>
        <div className="flex items-center gap-2">
            <div className="relative">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')} 
                    className="appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full py-2 pl-10 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                </select>
                <LanguageIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" />
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {isDarkMode ? <SunIcon className="h-5 w-5"/> : <MoonIcon className="h-5 w-5"/>}
            </button>
            <button onClick={() => setIsProfileModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow">
                {t.myProfile}
            </button>
        </div>
      </header>
      
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg w-11/12 max-w-lg" role="alert">
          <strong className="font-bold">{t.error}: </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{t.close}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <main className="flex-grow overflow-y-auto">
        {renderContent()}
      </main>

      {isProfileModalOpen && (
        <ProfileModal 
            userProfile={userProfile}
            onSave={handleProfileSave}
            onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}