import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentCategory } from '../types';

interface DocumentSearchProps {
  categories: DocumentCategory[];
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  onSortChange: (sort: SortOption) => void;
}

interface SearchFilters {
  category?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  fileType?: string;
  processed?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'name' | 'size';

export const DocumentSearch: React.FC<DocumentSearchProps> = ({
  categories,
  onSearch,
  onFilterChange,
  onSortChange,
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    onSortChange(newSort);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Filters
        </button>
      </form>

      <motion.div
        initial={false}
        animate={{ height: isFilterOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="bg-white p-4 rounded-md border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  handleFilterChange({
                    category: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) =>
                    handleFilterChange({
                      dateRange: { ...filters.dateRange, start: e.target.value },
                    })
                  }
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) =>
                    handleFilterChange({
                      dateRange: { ...filters.dateRange, end: e.target.value },
                    })
                  }
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Processing Status</label>
              <select
                value={filters.processed === undefined ? '' : filters.processed.toString()}
                onChange={(e) =>
                  handleFilterChange({
                    processed: e.target.value ? e.target.value === 'true' : undefined,
                  })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="true">Processed</option>
                <option value="false">Not Processed</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {query && `Search results for "${query}"`}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 