import React, { useState } from 'react';
import {
  signInWithGoogle,
  createAuthUserWithEmailAndPassword,
  signInAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../services/firebaseService';
import { useTranslations } from '../contexts/LanguageContext';
import { GoogleIcon } from './icons/GoogleIcon';
import { FirebaseConfigErrorScreen } from './FirebaseConfigErrorScreen';
import { firebaseConfig } from '../firebase/config';

interface AuthScreenProps {
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBackToLanding }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showConfigError, setShowConfigError] = useState(false);
  const { t } = useTranslations();

  const handleAuthError = (err: any) => {
    console.error(err);
    if (err.code === 'auth/unauthorized-domain') {
      setShowConfigError(true);
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
       setError("Failed to sign in. Please check your credentials.");
    } else if (err.code === 'auth/email-already-in-use') {
       setError("Failed to sign up. The email may already be in use.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const logInWithGoogle = async () => {
    setError(null);
    setShowConfigError(false);
    try {
      const { user } = await signInWithGoogle();
      await createUserDocumentFromAuth(user);
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setShowConfigError(false);

    if (isLoginView) {
      // Sign in
      try {
        await signInAuthUserWithEmailAndPassword(email, password);
      } catch (err) {
        handleAuthError(err);
      }
    } else {
      // Sign up
      try {
        const { user } = await createAuthUserWithEmailAndPassword(email, password);
        await createUserDocumentFromAuth(user);
      } catch (err) {
        handleAuthError(err);
      }
    }
  };

  if (showConfigError) {
    return (
      <FirebaseConfigErrorScreen 
        projectId={firebaseConfig.projectId}
        authDomain={firebaseConfig.authDomain}
        onRetry={() => setShowConfigError(false)}
      />
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="relative w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <button
          onClick={onBackToLanding}
          className="absolute top-4 left-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          aria-label={t.back}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
          {isLoginView ? t.login : t.signup}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {isLoginView ? 'Welcome back!' : 'Create an account to get started.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">{t.email}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder={t.email}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t.password}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder={t.password}
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-100 dark:bg-red-900/50 p-2 rounded-md">
                {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoginView ? t.login : t.signup}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={logInWithGoogle}
              className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              {t.loginWithGoogle}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError(null);
            }}
            className="font-medium text-green-600 dark:text-green-400 hover:text-green-500"
          >
            {isLoginView ? t.signup : t.login}
          </button>
        </p>
      </div>
    </div>
  );
};
