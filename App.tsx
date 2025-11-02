import React, { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { Scanner } from './components/Scanner';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ProfileModal } from './components/ProfileModal';
// FIX: ApiKeyScreen is no longer used as API key is handled by environment variables.
// import { ApiKeyScreen } from './components/ApiKeyScreen';
import { Navbar } from './components/Navbar';
import { View, ScanMode, UserProfile, HealthCondition, AnalysisResult, NutritionalInfo } from './types';
import { analyzeFoodFromImage, analyzeFoodFromQR, getHealthRecommendation } from './services/geminiService';
import { useI18n } from './hooks/useI18n';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export default function App() {
  // FIX: Removed API Key state management. API key is now handled by environment variables.
  const [view, setView] = useState<View>(View.HOME);
  const [scanMode, setScanMode] = useState<ScanMode>(ScanMode.IMAGE);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      age: null,
      healthCondition: HealthCondition.NONE,
      allergies: [],
    };
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { t } = useI18n();

  // FIX: Removed API Key handlers as the key is no longer managed in the UI.

  const handleSaveProfile = (profile: UserProfile) => {
      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
  }

  const handleAnalysis = useCallback(async (getNutritionalInfo: () => Promise<NutritionalInfo>) => {
    // FIX: Removed API key check.
    setIsLoading(true);
    setError(null);
    try {
      const nutritionalInfo = await getNutritionalInfo();
      // FIX: Removed apiKey argument.
      const recommendation = await getHealthRecommendation(nutritionalInfo, userProfile);
      setAnalysisResult({ ...recommendation, nutritionalInfo });
      setView(View.RESULTS);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      // FIX: Simplified error handling. No special case for API key errors in UI.
      setError(errorMessage);
      setView(View.HOME);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);
  
  const handleImageCapture = useCallback((imageSrc: string) => {
    setScannedImage(imageSrc);
    const base64Image = imageSrc.split(',')[1];
    // FIX: Removed apiKey argument.
    handleAnalysis(() => analyzeFoodFromImage(base64Image, 'image/jpeg'));
  }, [handleAnalysis]);
  
  const handleImageUpload = useCallback(async (file: File) => {
    try {
        const base64Image = await fileToBase64(file);
        const imageSrc = URL.createObjectURL(file);
        setScannedImage(imageSrc);
        // FIX: Removed apiKey argument.
        await handleAnalysis(() => analyzeFoodFromImage(base64Image, file.type));
    } catch (e) {
        console.error("Error processing file upload:", e);
        setError("There was an error reading the file. Please try a different image.");
        setIsLoading(false); 
        setView(View.HOME);
    }
  }, [handleAnalysis]);

  const handleQrCodeScan = useCallback((data: string) => {
    setScannedImage(null);
    // FIX: Removed apiKey argument.
    handleAnalysis(() => analyzeFoodFromQR(data));
  }, [handleAnalysis]);

  const handleModeSelect = (mode: ScanMode) => {
    setScanMode(mode);
    setView(View.SCANNING);
  };

  const resetApp = () => {
    setView(View.HOME);
    setAnalysisResult(null);
    setScannedImage(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
          <p className="mt-4 text-xl">{t('analyzing')}</p>
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

  // FIX: Removed ApiKeyScreen rendering. App starts at HomeScreen.

  return (
    <div className="h-screen w-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 antialiased overflow-y-auto">
      <Navbar onProfileClick={() => setIsProfileModalOpen(true)} isScannerActive={view === View.SCANNING} />
      
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg w-11/12 max-w-lg" role="alert">
          <strong className="font-bold">{t('error')}: </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{t('close')}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <main className="h-full w-full pt-16">
        {renderContent()}
      </main>

      {isProfileModalOpen && (
        <ProfileModal 
            userProfile={userProfile}
            onSave={handleSaveProfile}
            onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}