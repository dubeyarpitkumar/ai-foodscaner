import React, { useState, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { Scanner } from './components/Scanner';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ProfileModal } from './components/ProfileModal';
import { View, ScanMode, UserProfile, HealthCondition, AnalysisResult, NutritionalInfo } from './types';
import { analyzeFoodFromImage, analyzeFoodFromQR, getHealthRecommendation } from './services/geminiService';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export default function App() {
  const [view, setView] = useState<View>(View.HOME);
  const [scanMode, setScanMode] = useState<ScanMode>(ScanMode.IMAGE);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: null,
    healthCondition: HealthCondition.NONE,
    allergies: [],
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleAnalysis = useCallback(async (getNutritionalInfo: () => Promise<NutritionalInfo>) => {
    setIsLoading(true);
    setError(null);
    try {
      const nutritionalInfo = await getNutritionalInfo();
      const recommendation = await getHealthRecommendation(nutritionalInfo, userProfile);
      setAnalysisResult({ ...recommendation, nutritionalInfo });
      setView(View.RESULTS);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setView(View.HOME);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);
  
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
    setScannedImage(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900 bg-opacity-90">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
          <p className="mt-4 text-xl">Analyzing your food...</p>
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
    <div className="h-screen w-screen font-sans bg-gray-50 dark:bg-gray-900 antialiased overflow-y-auto">
       <header className={`absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-transparent ${view === View.SCANNING ? 'hidden' : ''}`}>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">NutriScan AI</h1>
        <button onClick={() => setIsProfileModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow">
            My Profile
        </button>
      </header>
      
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg w-11/12 max-w-lg" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <main className="h-full w-full pt-16">
        {renderContent()}
      </main>

      {isProfileModalOpen && (
        <ProfileModal 
            userProfile={userProfile}
            onSave={setUserProfile}
            onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}