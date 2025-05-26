import React from 'react';
import { motion } from 'framer-motion';
import { Document } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface DocumentDetailProps {
  document: Document;
  isLoading?: boolean;
  error?: Error;
  onErrorDismiss?: () => void;
  onDownload: (documentId: number) => Promise<void>;
  onShare: (documentId: number) => Promise<void>;
  onDelete: (documentId: number) => Promise<void>;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({
  document,
  isLoading = false,
  error,
  onErrorDismiss,
  onDownload,
  onShare,
  onDelete,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorMessage error={error} onDismiss={onErrorDismiss} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{document.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Version {document.version} • Uploaded {formatDate(document.uploaded_at)}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onDownload(document.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download
            </button>
            <button
              onClick={() => onShare(document.id)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Share
            </button>
            <button
              onClick={() => onDelete(document.id)}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">File Information</h2>
            <dl className="mt-2 space-y-1">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">File Type</dt>
                <dd className="text-sm text-gray-900">{document.file_type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">File Size</dt>
                <dd className="text-sm text-gray-900">{formatFileSize(document.file_size)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">{document.category?.name || 'Uncategorized'}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Processing Status</h2>
            <dl className="mt-2 space-y-1">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">
                  {document.is_processed ? 'Processed' : 'Processing'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDate(document.uploaded_at)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {document.processed_text && (
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Extracted Text</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{document.processed_text}</p>
            </div>
          </div>
        )}
      </motion.div>

      {document.versions && document.versions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Version History</h2>
          <div className="space-y-4">
            {document.versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">Version {version.version}</p>
                  <p className="text-sm text-gray-500">{formatDate(version.created_at)}</p>
                </div>
                <button
                  onClick={() => onDownload(version.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}; 