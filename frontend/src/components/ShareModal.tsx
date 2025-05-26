import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (userIds: number[], permissions: string[]) => Promise<void>;
  users: User[];
  documentTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
  users,
  documentTitle,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<string[]>(['view']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onShare(selectedUsers, permissions);
      onClose();
    } catch (err) {
      setError('Failed to share document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const togglePermission = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Share "{documentTitle}"
                      </h3>
                      <div className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Select Users
                            </label>
                            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                              {users.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50"
                                >
                                  <input
                                    type="checkbox"
                                    id={`user-${user.id}`}
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => toggleUser(user.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor={`user-${user.id}`}
                                    className="ml-3 block text-sm text-gray-900"
                                  >
                                    {user.username}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Permissions
                            </label>
                            <div className="mt-2 space-y-2">
                              {['view', 'edit', 'delete'].map((permission) => (
                                <div key={permission} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`permission-${permission}`}
                                    checked={permissions.includes(permission)}
                                    onChange={() => togglePermission(permission)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor={`permission-${permission}`}
                                    className="ml-3 block text-sm text-gray-900 capitalize"
                                  >
                                    {permission}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {error && (
                            <div className="text-sm text-red-600 mt-2">{error}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sharing...' : 'Share'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}; 