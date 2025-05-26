import React from 'react';
import { motion } from 'framer-motion';
import { Document } from '../types';

interface DocumentComparisonProps {
  version1: Document;
  version2: Document;
  differences: {
    added: string[];
    removed: string[];
    modified: {
      before: string;
      after: string;
    }[];
  };
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({
  version1,
  version2,
  differences,
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Version {version1.version}
            </h3>
            <p className="text-sm text-gray-500">
              Uploaded {formatDate(version1.uploaded_at)}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Version {version2.version}
            </h3>
            <p className="text-sm text-gray-500">
              Uploaded {formatDate(version2.uploaded_at)}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Changes</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {differences.added.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Added Content</h3>
              <div className="space-y-2">
                {differences.added.map((text, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-md p-3"
                  >
                    <p className="text-sm text-green-800">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {differences.removed.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Removed Content</h3>
              <div className="space-y-2">
                {differences.removed.map((text, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-md p-3"
                  >
                    <p className="text-sm text-red-800">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {differences.modified.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Modified Content</h3>
              <div className="space-y-4">
                {differences.modified.map((change, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Before:</p>
                      <p className="text-sm text-yellow-800">{change.before}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">After:</p>
                      <p className="text-sm text-green-800">{change.after}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {differences.added.length === 0 &&
            differences.removed.length === 0 &&
            differences.modified.length === 0 && (
              <div className="px-6 py-4">
                <p className="text-sm text-gray-500">No changes found between versions.</p>
              </div>
            )}
        </div>
      </motion.div>
    </div>
  );
}; 