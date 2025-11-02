
import React from 'react';
import { AnalysisResult } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  scannedImage?: string | null;
  onReset: () => void;
}

const NutritionItem: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{value}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, scannedImage, onReset }) => {
  const { t } = useTranslations();
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500 dark:text-gray-400">{t.noResults}</p>
      </div>
    );
  }

  const { nutritionalInfo, healthRecommendation, isHealthy } = result;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {scannedImage && (
          <img src={scannedImage} alt={nutritionalInfo.foodName} className="w-full h-64 object-cover" />
        )}

        <div className="p-6">
          <h2 className="text-3xl font-bold text-center">{nutritionalInfo.foodName}</h2>
          
          <div className={`mt-4 p-4 rounded-lg flex items-center justify-center gap-4 ${isHealthy ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
              {isHealthy ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              }
            </div>
            <p className={`text-lg font-semibold ${isHealthy ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>{healthRecommendation}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-center">{t.nutritionalInformation}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <NutritionItem label={t.calories} value={nutritionalInfo.calories} unit={t.kcal} />
              <NutritionItem label={t.protein} value={nutritionalInfo.protein} unit={t.grams} />
              <NutritionItem label={t.fat} value={nutritionalInfo.fat} unit={t.grams} />
              <NutritionItem label={t.sugar} value={nutritionalInfo.sugar} unit={t.grams} />
              <NutritionItem label={t.fiber} value={nutritionalInfo.fiber} unit={t.grams} />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-center">{t.ingredients}</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {nutritionalInfo.ingredients.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors shadow-lg"
        >
          {t.scanAnotherItem}
        </button>
      </div>
    </div>
  );
};
