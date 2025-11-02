
import React, { useRef } from 'react';
import { ScanMode } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { UploadIcon } from './icons/UploadIcon';
import { useTranslations } from '../contexts/LanguageContext';

interface HomeScreenProps {
  onModeSelect: (mode: ScanMode) => void;
  onImageUpload: (file: File) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onModeSelect, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslations();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400">
          {t.nutriScanAI}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          {t.smartFoodAnalyzer}
        </p>
        <p className="mt-2 text-md md:text-lg text-gray-500 dark:text-gray-400">
          {t.homeScreenDescription}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onModeSelect(ScanMode.IMAGE)}
            className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <CameraIcon className="h-16 w-16 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform" />
            <span className="mt-4 text-xl font-semibold">{t.scanFood}</span>
            <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.scanFoodDescription}</span>
          </button>
          <button
            onClick={() => onModeSelect(ScanMode.QR)}
            className="group flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <QrCodeIcon className="h-16 w-16 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform" />
            <span className="mt-4 text-xl font-semibold">{t.scanQRCode}</span>
            <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.scanQRCodeDescription}</span>
          </button>
        </div>
        
        <div className="mt-8">
            <button
                onClick={handleUploadClick}
                className="group w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
                <UploadIcon className="h-8 w-8 text-green-500 dark:text-green-400 mr-4" />
                <div>
                  <span className="text-lg font-semibold">{t.uploadImage}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.uploadImageDescription}</p>
                </div>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
        </div>
      </div>
    </div>
  );
};
