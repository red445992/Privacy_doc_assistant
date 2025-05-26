import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentCard } from './DocumentCard';
import { DocumentUpload } from './DocumentUpload';
import { Document, ApiError } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  error?: ApiError;
  onErrorDismiss?: () => void;
  onUpload: (file: File) => Promise<void>;
  onShare: (documentId: number) => Promise<void>;
  onDelete: (documentId: number) => Promise<void>;
  onDownload: (documentId: number) => Promise<void>;
  onViewVersions: (documentId: number) => Promise<void>;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading = false,
  error,
  onErrorDismiss,
  onUpload,
  onShare,
  onDelete,
  onDownload,
  onViewVersions,
}) => {
  const [uploadError, setUploadError] = useState<ApiError | undefined>();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(undefined);
    try {
      await onUpload(file);
    } catch (err) {
      setUploadError(err as ApiError);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {(error || uploadError) && (
          <ErrorMessage
            error={error || uploadError}
            onDismiss={() => {
              if (error) onErrorDismiss?.();
              if (uploadError) setUploadError(undefined);
            }}
          />
        )}
      </AnimatePresence>

      <DocumentUpload
        onUpload={handleUpload}
        isLoading={isUploading}
        error={uploadError}
        onErrorDismiss={() => setUploadError(undefined)}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <p className="text-lg">No documents found</p>
          <p className="text-sm">Upload a document to get started</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onShare={() => onShare(document.id)}
              onDelete={() => onDelete(document.id)}
              onDownload={() => onDownload(document.id)}
              onViewVersions={() => onViewVersions(document.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}; 