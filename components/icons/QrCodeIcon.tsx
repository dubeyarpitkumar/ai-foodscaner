
import React from 'react';

export const QrCodeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-6 w-6"}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
     <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h1v1H4V4zm2 0h1v1H6V4zm2 0h1v1H8V4zm4 0h1v1h-1V4zm2 0h1v1h-1V4zm2 0h1v1h-1V4zM4 6h1v1H4V6zm14 0h1v1h-1V6zM4 8h1v1H4V8zm14 0h1v1h-1V8zM4 12h1v1H4v-1zm2 0h1v1H6v-1zm2 0h1v1H8v-1zm6 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h1v1h-1v-1zM4 14h1v1H4v-1zm14 0h1v1h-1v-1zM4 16h1v1H4v-1zm2 0h1v1H6v-1zm2 0h1v1H8v-1zm10 0h1v1h-1v-1zM4 18h1v1H4v-1zm2 0h1v1H6v-1zm2 0h1v1H8v-1zm10 0h1v1h-1v-1zM6 6h3v3H6V6zm8 0h3v3h-3V6zM6 14h3v3H6v-3zm8 0h3v3h-3v-3z" />
  </svg>
);
