import React from 'react';

export const ApiKeyErrorScreen = () => {
  return (
    // Use min-h-screen to ensure the container fills the viewport height, even on mobile browsers with dynamic toolbars.
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-4">
      {/* Add w-full to ensure the card does not exceed parent padding on small screens. */}
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
          API Key Configuration Error
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The application requires a Google AI API Key to function, but it could not be found.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Please ensure the <code>API_KEY</code> is configured correctly in your application's environment. The application cannot start without it.
        </p>
      </div>
    </div>
  );
};