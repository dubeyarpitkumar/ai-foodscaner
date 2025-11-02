
import React from 'react';

export const QrCodeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h4v4H4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6-6h4v4h-4V4zM10 4h4v4h-4V4zm6 6h4v4h-4v-4zm-6 6h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4z" />
    <path d="M14.5 14.5h1v1h-1z m2 0h1v1h-1z m-2 2h1v1h-1z m2 0h1v1h-1z m-2 2h1v1h-1z m2 0h1v1h-1z" />
  </svg>
);
