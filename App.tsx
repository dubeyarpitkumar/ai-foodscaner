import React, { useState, useEffect } from 'react';
import { onAuthStateChangedListener, getUserProfile, signOutUser } from './services/firebaseService';
import type { User } from 'firebase/auth';

import { LandingScreen } from './components/LandingScreen';
import { AuthScreen } from './components/AuthScreen';
import { ProfileForm } from './components/ProfileForm';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './types';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
        <p className="mt-4 text-xl">Loading...</p>
    </div>
);

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'LANDING' | 'AUTH'>('LANDING');

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (authUser) => {
            setIsLoading(true);
            if (authUser) {
                try {
                    const userProfile = await getUserProfile(authUser.uid);
                    setUser(authUser);
                    setProfile(userProfile);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // If we can't get the profile, sign out to avoid an inconsistent state
                    signOutUser(); 
                }
            } else {
                setUser(null);
                setProfile(null);
                setView('LANDING');
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const handleProfileSaved = (newProfile: UserProfile) => {
        setProfile(newProfile);
    };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (user) {
        // A profile is considered complete if an age has been set, as it's a key piece
        // of information for health recommendations and is blank on new profiles.
        if (profile && profile.age !== null) {
            return <Dashboard user={user} initialProfile={profile} onSignOut={signOutUser} />;
        } else {
            return <ProfileForm user={user} onProfileSaved={handleProfileSaved} initialProfile={profile} />;
        }
    }

    switch (view) {
        case 'AUTH':
            return <AuthScreen onBackToLanding={() => setView('LANDING')} />;
        case 'LANDING':
        default:
            return <LandingScreen onGetStarted={() => setView('AUTH')} />;
    }
}