import axios, { AxiosError, AxiosInstance } from 'axios';
import { Document, DocumentCategory, ApiError } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'An error occurred',
          code: error.response?.status?.toString(),
          details: error.response?.data?.details,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Document endpoints
  async getDocuments(params?: { category?: number; is_processed?: boolean }) {
    const response = await this.api.get<Document[]>('/documents/', { params });
    return response.data;
  }

  async getDocument(id: number) {
    const response = await this.api.get<Document>(`/documents/${id}/`);
    return response.data;
  }

  async createDocument(data: FormData) {
    const response = await this.api.post<Document>('/documents/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateDocument(id: number, data: Partial<Document>) {
    const response = await this.api.patch<Document>(`/documents/${id}/`, data);
    return response.data;
  }

  async deleteDocument(id: number) {
    await this.api.delete(`/documents/${id}/`);
  }

  async shareDocument(id: number, userIds: number[]) {
    const response = await this.api.post(`/documents/${id}/share/`, { user_ids: userIds });
    return response.data;
  }

  async unshareDocument(id: number, userIds: number[]) {
    const response = await this.api.post(`/documents/${id}/unshare/`, { user_ids: userIds });
    return response.data;
  }

  async searchDocuments(query: string, params?: { category?: number; is_processed?: boolean }) {
    const response = await this.api.get<Document[]>('/documents/search/', {
      params: { q: query, ...params },
    });
    return response.data;
  }

  async batchProcessDocuments(documentIds: number[]) {
    const response = await this.api.post('/documents/batch_process/', { document_ids: documentIds });
    return response.data;
  }

  async batchExportDocuments(documentIds: number[], format: string = 'json') {
    const response = await this.api.post('/documents/batch_export/', {
      document_ids: documentIds,
      format,
    });
    return response.data;
  }

  // Category endpoints
  async getCategories() {
    const response = await this.api.get<DocumentCategory[]>('/documents/categories/');
    return response.data;
  }

  async createCategory(data: Partial<DocumentCategory>) {
    const response = await this.api.post<DocumentCategory>('/documents/categories/', data);
    return response.data;
  }

  async updateCategory(id: number, data: Partial<DocumentCategory>) {
    const response = await this.api.patch<DocumentCategory>(`/documents/categories/${id}/`, data);
    return response.data;
  }

  async deleteCategory(id: number) {
    await this.api.delete(`/documents/categories/${id}/`);
  }
}

export const apiService = new ApiService(); 