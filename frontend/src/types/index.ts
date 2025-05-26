export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  organization?: string;
}

export interface DocumentCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Document {
  id: number;
  title: string;
  file: string;
  file_url: string;
  uploaded_at: string;
  processed_text: string;
  is_processed: boolean;
  file_size: number;
  file_type: string;
  user: string;
  category?: number;
  category_name?: string;
  version: number;
  parent_version?: number;
  is_shared: boolean;
  shared_with: number[];
  version_history: {
    version: number;
    uploaded_at: string;
    file_url: string;
  }[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
} 