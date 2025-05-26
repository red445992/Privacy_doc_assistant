import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Document } from '../types';

interface VersionHistoryProps {
  versions: Document[];
  onDownload: (versionId: number) => Promise<void>;
  onCompare: (version1Id: number, version2Id: number) => Promise<void>;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  onDownload,
  onCompare,
}) => {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleVersionSelect = (versionId: number) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter((id) => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const handleCompare = async () => {
    if (selectedVersions.length !== 2) return;

    setIsComparing(true);
    try {
      await onCompare(selectedVersions[0], selectedVersions[1]);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Version History</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {versions.map((version) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedVersions.includes(version.id)}
                  onChange={() => handleVersionSelect(version.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Version {version.version}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(version.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onDownload(version.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedVersions.length === 2 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleCompare}
            disabled={isComparing}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComparing ? 'Comparing...' : 'Compare Selected Versions'}
          </button>
        </div>
      )}
    </div>
  );
}; 