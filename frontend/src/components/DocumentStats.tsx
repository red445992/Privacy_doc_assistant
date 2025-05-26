import React from 'react';
import { motion } from 'framer-motion';
import { Document } from '../types';

interface DocumentStatsProps {
  documents: Document[];
}

interface Stats {
  totalDocuments: number;
  totalSize: number;
  averageSize: number;
  processedCount: number;
  unprocessedCount: number;
  categoryDistribution: Record<string, number>;
  fileTypeDistribution: Record<string, number>;
  recentUploads: Document[];
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({ documents }) => {
  const calculateStats = (): Stats => {
    const stats: Stats = {
      totalDocuments: documents.length,
      totalSize: 0,
      averageSize: 0,
      processedCount: 0,
      unprocessedCount: 0,
      categoryDistribution: {},
      fileTypeDistribution: {},
      recentUploads: [],
    };

    documents.forEach((doc) => {
      // Calculate total and average size
      stats.totalSize += doc.file_size;

      // Count processed and unprocessed documents
      if (doc.is_processed) {
        stats.processedCount++;
      } else {
        stats.unprocessedCount++;
      }

      // Calculate category distribution
      const category = doc.category?.name || 'Uncategorized';
      stats.categoryDistribution[category] = (stats.categoryDistribution[category] || 0) + 1;

      // Calculate file type distribution
      stats.fileTypeDistribution[doc.file_type] =
        (stats.fileTypeDistribution[doc.file_type] || 0) + 1;
    });

    // Calculate average size
    stats.averageSize = stats.totalDocuments > 0 ? stats.totalSize / stats.totalDocuments : 0;

    // Get recent uploads (last 5 documents)
    stats.recentUploads = [...documents]
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
      .slice(0, 5);

    return stats;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalDocuments}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Size</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {formatFileSize(stats.totalSize)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Processed</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.processedCount}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {((stats.processedCount / stats.totalDocuments) * 100).toFixed(1)}% of total
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-sm font-medium text-gray-500">Average Size</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {formatFileSize(stats.averageSize)}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{category}</span>
                  <span className="text-gray-900">{count} documents</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(count / stats.totalDocuments) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h3>
          <div className="space-y-4">
            {stats.recentUploads.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(doc.uploaded_at)} • {formatFileSize(doc.file_size)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    doc.is_processed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {doc.is_processed ? 'Processed' : 'Processing'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 