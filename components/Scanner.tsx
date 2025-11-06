import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
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

  useEffect(() => {
    if (mode !== ScanMode.QR) {
      return;
    }

    const reader = new BrowserMultiFormatReader();
    
    const startScan = async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video;
        // Wait until video is ready. readyState 4 means it has enough data to play.
        if (video.readyState === 4) {
          try {
            // decodeContinuously will keep scanning until a code is found or it's stopped.
            await reader.decodeContinuously(video, (result, err) => {
              if (result) {
                // Once a result is found, stop scanning and call the parent callback.
                // The component will unmount, triggering the cleanup function.
                reader.reset();
                onQrCodeScan(result.getText());
              }
              // NotFoundException is thrown when no code is found in a frame. This is normal.
              // We only want to log other, unexpected errors.
              if (err && !(err instanceof NotFoundException)) {
                console.error('Barcode scan error:', err);
              }
            });
          } catch (e) {
            console.error('Error starting scanner:', e);
            setError(t.errorCameraAccess);
          }
        } else {
          // If video not ready, wait a bit and try again.
          setTimeout(startScan, 200);
        }
      } else {
         // If webcamRef not ready, wait a bit and try again.
         setTimeout(startScan, 200);
      }
    };
    
    startScan();

    return () => {
      // This is the cleanup function. It's crucial to release the camera.
      reader.reset();
    };
  }, [mode, onQrCodeScan, t.errorCameraAccess]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col justify-center items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full h-full object-cover"
        videoConstraints={{ facingMode: "environment" }}
        onUserMedia={() => {}}
        onUserMediaError={(err) => setError(t.errorCameraAccess)}
        mirrored={false}
        disablePictureInPicture={false}
        forceScreenshotSourceSize={false}
        imageSmoothing={true}
        screenshotQuality={0.92}
      />
      
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
