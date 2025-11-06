import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { UserProfile, HealthCondition, Gender, DietType } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { updateUserProfileDocument } from '../services/firebaseService';

interface ProfileFormProps {
  user: User;
  onProfileSaved: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onProfileSaved, initialProfile }) => {
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || user.displayName || '');
  const [age, setAge] = useState(initialProfile?.age?.toString() || '');
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || Gender.PREFER_NOT_TO_SAY);
  const [dietType, setDietType] = useState<DietType>(initialProfile?.dietType || DietType.NONE);
  const [healthCondition, setHealthCondition] = useState<HealthCondition>(initialProfile?.healthCondition || HealthCondition.NONE);
  const [allergies, setAllergies] = useState(initialProfile?.allergies?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslations();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const profileData: Partial<UserProfile> = {
      displayName,
      age: age ? parseInt(age, 10) : null,
      gender,
      dietType,
      healthCondition,
      allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
    };

    try {
      await updateUserProfileDocument(user.uid, profileData);
      const fullProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        ...profileData
      } as UserProfile; // We cast here because we know we've provided all required fields
      onProfileSaved(fullProfile);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setIsLoading(false);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">{t.createYourProfile}</h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{t.completeProfile}</p>
        
        <form onSubmit={handleSave} className="mt-8 space-y-4">
           <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.displayName}</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 dark:text-gray-100"
              placeholder={t.displayNamePlaceholder}
              required
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
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {isLoading ? 'Saving...' : t.saveAndContinue}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};