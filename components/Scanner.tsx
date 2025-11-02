
import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { ScanMode } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { useTranslations } from '../contexts/LanguageContext';

interface ScannerProps {
  mode: ScanMode;
  onImageCapture: (imageSrc: string) => void;
  onQrCodeScan: (data: string) => void;
  onBack: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ mode, onImageCapture, onQrCodeScan, onBack }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageCapture(imageSrc);
    } else {
      setError(t.errorImageCapture);
    }
  }, [webcamRef, onImageCapture, t]);

  const scanQrCode = useCallback(() => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          onQrCodeScan(code.data);
        }
      }
    }
  }, [onQrCodeScan]);

  useEffect(() => {
    let interval: number | undefined;
    if (mode === ScanMode.QR) {
      interval = window.setInterval(scanQrCode, 200);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [mode, scanQrCode]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col justify-center items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{ facingMode: "environment" }}
        onUserMediaError={(err) => setError(t.errorCameraAccess)}
      />
      <canvas ref={canvasRef} className="hidden" />

      {mode === ScanMode.QR && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-full max-w-sm aspect-square border-4 border-dashed border-green-400 rounded-2xl bg-black bg-opacity-20 animate-pulse"></div>
            <p className="absolute bottom-24 text-white text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-lg">{t.pointAtQRCode}</p>
        </div>
      )}
      
      {error && <div className="absolute top-5 left-5 right-5 bg-red-500 text-white p-4 rounded-lg text-center z-20">{error}</div>}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex justify-center items-center">
        <button
          onClick={onBack}
          className="absolute left-4 bottom-4 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          aria-label={t.back}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {mode === ScanMode.IMAGE && (
          <button
            onClick={capture}
            className="w-20 h-20 bg-white rounded-full border-4 border-green-500 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-400"
            aria-label={t.captureImage}
          >
            <CameraIcon className="w-10 h-10 text-green-600" />
          </button>
        )}
      </div>
    </div>
  );
};
