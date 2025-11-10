import React, { useState } from 'react';
import { UserProfile, HealthCondition, Gender, DietType } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface ProfileModalProps {
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ userProfile, onSave, onClose }) => {
  const [displayName, setDisplayName] = useState<string>(userProfile.displayName || '');
  const [age, setAge] = useState<string>(userProfile.age?.toString() || '');
  const [gender, setGender] = useState<Gender>(userProfile.gender);
  const [dietType, setDietType] = useState<DietType>(userProfile.dietType);
  const [healthCondition, setHealthCondition] = useState<HealthCondition>(userProfile.healthCondition);
  const [allergies, setAllergies] = useState<string>(userProfile.allergies.join(', '));
  const { t } = useTranslations();

  const handleSave = async () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      displayName,
      age: age ? parseInt(age, 10) : null,
      gender,
      dietType,
      healthCondition,
      allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
    };
    await onSave(updatedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">{t.yourHealthProfile}</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.displayName}</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 dark:text-gray-100"
              placeholder={t.displayNamePlaceholder}
            />
          </div>
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
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.gender}</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100"
            >
              {Object.values(Gender).map(g => (
                <option key={g} value={g}>{t.genders[g]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.dietType}</label>
            <select
              id="dietType"
              value={dietType}
              onChange={(e) => setDietType(e.target.value as DietType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100"
            >
              {Object.values(DietType).map(d => (
                <option key={d} value={d}>{t.dietTypes[d]}</option>
              ))}
            </select>
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
        </div>

        <div className="p-6 md:p-8 pt-0 flex justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
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
