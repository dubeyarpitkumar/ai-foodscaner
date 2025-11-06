import React from 'react';
import { Dashboard } from './components/Dashboard';
import { ApiKeyErrorScreen } from './components/ApiKeyErrorScreen';

// The Google AI API key is expected to be set in the environment variables.
const API_KEY = process.env.API_KEY;

export default function App() {
    // If the API_KEY is not available, render an error screen
    // to inform the user about the configuration issue.
    // This prevents the app from making API calls that would fail.
    if (!API_KEY) {
        return <ApiKeyErrorScreen />;
    }
    
    // If the API key exists, render the main dashboard.
    return <Dashboard />;
}
