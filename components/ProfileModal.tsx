
import React, { useState } from 'react';
import { UserProfile, HealthCondition } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface ProfileModalProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ userProfile, onSave, onClose }) => {
  const [age, setAge] = useState<string>(userProfile.age?.toString() || '');
  const [healthCondition, setHealthCondition] = useState<HealthCondition>(userProfile.healthCondition);
  const [allergies, setAllergies] = useState<string>(userProfile.allergies.join(', '));
  const { t } = useTranslations();

  const handleSave = () => {
    onSave({
      age: age ? parseInt(age, 10) : null,
      healthCondition,
      allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">{t.yourHealthProfile}</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.age}</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 dark:text-gray-100"
              placeholder={t.agePlaceholder}
            />
          </div>
          
          <div>
            <label htmlFor="healthCondition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.healthGoal}</label>
            <select
              id="healthCondition"
              value={healthCondition}
              onChange={(e) => setHealthCondition(e.target.value as HealthCondition)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100"
            >
              {Object.values(HealthCondition).map(condition => (
                <option key={condition} value={condition}>{t.healthConditions[condition]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.allergies}</label>
            <input
              type="text"
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 dark:text-gray-100"
              placeholder={t.allergiesPlaceholder}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow"
          >
            {t.saveProfile}
          </button>
        </div>
      </div>
    </div>
  );
};
