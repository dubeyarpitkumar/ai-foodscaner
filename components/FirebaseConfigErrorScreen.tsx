import React, { useState } from 'react';

interface FirebaseConfigErrorScreenProps {
  projectId: string;
  authDomain: string;
  onRetry: () => void;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const FirebaseConfigErrorScreen: React.FC<FirebaseConfigErrorScreenProps> = ({ projectId, authDomain, onRetry }) => {
  const currentHost = window.location.hostname;
  const [copied, setCopied] = useState<{ host: boolean; auth: boolean }>({ host: false, auth: false });

  const handleCopy = (textToCopy: string, key: 'host' | 'auth') => {
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setCopied(prev => ({ ...prev, [key]: false }));
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  const gcpCredentialsUrl = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-gray-800 dark:text-gray-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Firebase Configuration Required</h2>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            This app's domain is not authorized for Firebase Authentication. Please follow the steps below to fix this in your project settings.
          </p>
        </div>
        
        <div className="mt-6 text-left bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="font-semibold text-lg">How to fix this:</h3>
          <ol className="mt-2 list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
            <li>
              Go to the <a href={`https://console.firebase.google.com/project/${projectId}/authentication/settings`} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 font-medium hover:underline">Firebase Console</a> for your project.
            </li>
            <li>
              Navigate to the <strong>Authentication</strong> section and click the <strong>Settings</strong> tab.
            </li>
            <li>
              Under <strong>Authorized domains</strong>, click <strong>Add domain</strong>.
            </li>
            <li>
              Add the domain where the app is running:
              <div className="mt-2 flex items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
                <code className="text-sm font-semibold text-red-600 dark:text-red-400">{currentHost}</code>
                <button
                  onClick={() => handleCopy(currentHost, 'host')}
                  className={`flex items-center text-xs font-semibold px-2 py-1 rounded transition-colors ${
                    copied.host 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                >
                  {copied.host ? <CheckIcon /> : <CopyIcon />}
                  {copied.host ? 'Copied' : 'Copy'}
                </button>
              </div>
               <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Common domains are `localhost` for local development or your deployment URL.</p>
            </li>
             <li>
              Ensure your default auth domain is also present:
              <div className="mt-2 flex items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg p-2">
                <code className="text-sm">{authDomain}</code>
                <button
                  onClick={() => handleCopy(authDomain, 'auth')}
                  className={`flex items-center text-xs font-semibold px-2 py-1 rounded transition-colors ${
                    copied.auth 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                >
                  {copied.auth ? <CheckIcon /> : <CopyIcon />}
                  {copied.auth ? 'Copied' : 'Copy'}
                </button>
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-6 text-left bg-yellow-50 dark:bg-yellow-900/50 p-6 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <h3 className="font-semibold text-lg text-yellow-800 dark:text-yellow-200">Still not working? Troubleshooting tips:</h3>
          <ul className="mt-2 list-disc list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <li><strong>Wait a minute:</strong> It can take up to 2 minutes for changes in the Firebase Console to apply.</li>
              <li><strong>Check for typos:</strong> Ensure the domain was entered exactly as shown above, with no extra spaces or characters.</li>
              <li><strong>Clear cache:</strong> Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear your browser's cache.</li>
              <li><strong>Check API Key restrictions:</strong> In the <a href={gcpCredentialsUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">Google Cloud Console</a>, ensure your API key does not have "HTTP referrers" restrictions that would block this domain. For testing, you can set it to "None".</li>
          </ul>
        </div>

        <div className="mt-8">
            <button
              onClick={onRetry}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              I've added the domain, let's try again
            </button>
        </div>
      </div>
    </div>
  );
};
