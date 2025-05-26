import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { ApiError } from '../types';

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
  error?: ApiError;
  onErrorDismiss?: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  isLoading = false,
  error,
  onErrorDismiss,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          await onUpload(acceptedFiles[0]);
        } catch (err) {
          // Error is handled by the parent component
        }
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="w-full">
      <AnimatePresence>
        {error && <ErrorMessage error={error} onDismiss={onErrorDismiss} />}
      </AnimatePresence>

      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner size="large" />
            <p className="text-gray-600">Uploading document...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-600">
              <p className="text-lg font-medium">Drag and drop your PDF file here</p>
              <p className="text-sm">or click to browse</p>
            </div>
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB. Only PDF files are accepted.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}; 