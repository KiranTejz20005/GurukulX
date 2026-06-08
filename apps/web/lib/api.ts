import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Temporarily hardcode workspace and user for development until Auth is fully integrated
    'x-workspace-id': 'dev-workspace-123',
    'x-user-id': 'dev-user-123',
  },
});

export const api = {
  courses: {
    getAll: () => apiClient.get('/courses').then((res) => res.data),
    getOne: (id: string) => apiClient.get(`/courses/${id}`).then((res) => res.data),
    create: (data: { title: string, description?: string }) => apiClient.post('/courses', data).then((res) => res.data),
    update: (id: string, data: any) => apiClient.patch(`/courses/${id}`, data).then((res) => res.data),
    delete: (id: string) => apiClient.delete(`/courses/${id}`).then((res) => res.data),
  },
  modules: {
    create: (courseId: string, data: { title: string }) => apiClient.post(`/courses/${courseId}/modules`, data).then((res) => res.data),
    getAll: (courseId: string) => apiClient.get(`/courses/${courseId}/modules`).then((res) => res.data),
    update: (courseId: string, moduleId: string, data: any) => apiClient.patch(`/courses/${courseId}/modules/${moduleId}`, data).then((res) => res.data),
    delete: (courseId: string, moduleId: string) => apiClient.delete(`/courses/${courseId}/modules/${moduleId}`).then((res) => res.data),
  },
  lessons: {
    create: (moduleId: string, data: { title: string, type?: 'VIDEO' | 'TEXT' | 'QUIZ' }) => apiClient.post(`/modules/${moduleId}/lessons`, data).then((res) => res.data),
    getAll: (moduleId: string) => apiClient.get(`/modules/${moduleId}/lessons`).then((res) => res.data),
    update: (moduleId: string, lessonId: string, data: any) => apiClient.patch(`/modules/${moduleId}/lessons/${lessonId}`, data).then((res) => res.data),
    delete: (moduleId: string, lessonId: string) => apiClient.delete(`/modules/${moduleId}/lessons/${lessonId}`).then((res) => res.data),
  }
};
