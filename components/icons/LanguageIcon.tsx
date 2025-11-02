
import React from 'react';

export const LanguageIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className || "h-6 w-6"} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m4 13-4-4-4 4M1 12a9 9 0 0118 0 9 9 0 01-18 0zm16-2a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);
