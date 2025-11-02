import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';

interface ApiKeyScreenProps {
  onSave: (apiKey: string) => void;
  error: string | null;
  clearError: () => void;
}

export const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onSave, error, clearError }) => {
  const [apiKey, setApiKey] = useState('');
  const { t } = useI18n();

  const handleSaveClick = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  useEffect(() => {
    // Clear any previous API key errors when the component mounts
    clearError();
  }, [clearError]);
  
  const docLink = (
    <a 
      href="https://ai.google.dev/gemini-api/docs/api-key" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-green-400 underline hover:text-green-300"
    >
      {t('officialDocumentation')}
    </a>
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-gray-900 text-gray-200">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-400">{t('welcomeTitle')}</h1>
        <p className="mt-4 text-lg text-gray-300">
          {t('apiKeyPrompt')}
        </p>
        <p className="mt-2 text-sm text-gray-400">
          {t('apiKeyInfo', { link: docLink })}
        </p>

        <div className="mt-8">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-center"
            // FIX: The `placeholder` attribute must be a string. Cast the result of `t` to a string.
            placeholder={t('apiKeyPlaceholder') as string}
            aria-label="Google AI API Key"
          />
        </div>

        {error && (
            <div className="mt-4 text-red-400 bg-red-900 bg-opacity-50 border border-red-500 p-3 rounded-lg">
                {error}
            </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleSaveClick}
            disabled={!apiKey.trim()}
            className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    </div>
  );
};