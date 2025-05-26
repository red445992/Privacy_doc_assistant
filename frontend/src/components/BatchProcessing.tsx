import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface BatchProcessingProps {
  documents: Document[];
  onProcess: (documentIds: number[]) => Promise<void>;
  onExport: (documentIds: number[], format: string) => Promise<void>;
  onDelete: (documentIds: number[]) => Promise<void>;
}

export const BatchProcessing: React.FC<BatchProcessingProps> = ({
  documents,
  onProcess,
  onExport,
  onDelete,
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id));
    }
  };

  const handleSelectDocument = (documentId: number) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleProcess = async () => {
    if (selectedDocuments.length === 0) {
      setError('Please select at least one document');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await onProcess(selectedDocuments);
    } catch (err) {
      setError('Failed to process documents. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    if (selectedDocuments.length === 0) {
      setError('Please select at least one document');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      await onExport(selectedDocuments, exportFormat);
    } catch (err) {
      setError('Failed to export documents. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (selectedDocuments.length === 0) {
      setError('Please select at least one document');
      return;
    }

    if (!window.confirm('Are you sure you want to delete the selected documents?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(selectedDocuments);
      setSelectedDocuments([]);
    } catch (err) {
      setError('Failed to delete documents. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedDocuments.length === documents.length}
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            {selectedDocuments.length} of {documents.length} documents selected
          </span>
        </div>
        <div className="flex space-x-3">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="pdf">PDF</option>
            <option value="txt">Text</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedDocuments.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            onClick={handleProcess}
            disabled={isProcessing || selectedDocuments.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Process'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || selectedDocuments.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-md p-4"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {documents.map((document) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedDocuments.includes(document.id)}
                onChange={() => handleSelectDocument(document.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{document.title}</h3>
                <p className="text-sm text-gray-500">
                  {document.file_type} • {document.file_size} bytes
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {document.is_processed ? 'Processed' : 'Not Processed'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {(isProcessing || isExporting || isDeleting) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-sm text-gray-700">
              {isProcessing
                ? 'Processing documents...'
                : isExporting
                ? 'Exporting documents...'
                : 'Deleting documents...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 