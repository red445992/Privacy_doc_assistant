import React from 'react';
import { motion } from 'framer-motion';
import { Document } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface DocumentCardProps {
  document: Document;
  onShare?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onViewVersions?: (document: Document) => void;
  isLoading?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onShare,
  onDelete,
  onDownload,
  onViewVersions,
  isLoading = false,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{document.title}</h3>
          <span className="text-sm text-gray-500">v{document.version}</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p>Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}</p>
          <p>Size: {formatFileSize(document.file_size)}</p>
          <p>Type: {document.file_type.toUpperCase()}</p>
          {document.category_name && (
            <p>Category: {document.category_name}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {onDownload && (
              <button
                onClick={() => onDownload(document)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                disabled={isLoading}
              >
                Download
              </button>
            )}
            {onViewVersions && (
              <button
                onClick={() => onViewVersions(document)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                disabled={isLoading}
              >
                Versions
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {onShare && (
              <button
                onClick={() => onShare(document)}
                className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
                disabled={isLoading}
              >
                Share
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(document)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                disabled={isLoading}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="mt-4">
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>
    </motion.div>
  );
}; 