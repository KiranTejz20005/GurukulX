import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

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
    reorder: (courseId: string, moduleId: string, order: number) => apiClient.patch(`/courses/${courseId}/modules/${moduleId}/reorder`, { order }).then((res) => res.data),
    delete: (courseId: string, moduleId: string) => apiClient.delete(`/courses/${courseId}/modules/${moduleId}`).then((res) => res.data),
  },
  lessons: {
    create: (moduleId: string, data: { title: string, type?: 'VIDEO' | 'TEXT' | 'QUIZ' }) => apiClient.post(`/modules/${moduleId}/lessons`, data).then((res) => res.data),
    getAll: (moduleId: string) => apiClient.get(`/modules/${moduleId}/lessons`).then((res) => res.data),
    update: (moduleId: string, lessonId: string, data: any) => apiClient.patch(`/modules/${moduleId}/lessons/${lessonId}`, data).then((res) => res.data),
    delete: (moduleId: string, lessonId: string) => apiClient.delete(`/modules/${moduleId}/lessons/${lessonId}`).then((res) => res.data),
  },
  forums: {
    getAll: () => apiClient.get('/forums').then((res) => res.data),
    getOne: (id: string) => apiClient.get(`/forums/${id}`).then((res) => res.data),
    create: (data: { title: string, description?: string }) => apiClient.post('/forums', data).then((res) => res.data),
    createPost: (forumId: string, content: string) => apiClient.post(`/forums/${forumId}/posts`, { content }).then((res) => res.data),
    deletePost: (id: string) => apiClient.delete(`/forums/posts/${id}`).then((res) => res.data),
  },
  programs: {
    getAll: () => apiClient.get('/programs').then((res) => res.data),
    getOne: (id: string) => apiClient.get(`/programs/${id}`).then((res) => res.data),
    create: (data: { title: string, description?: string }) => apiClient.post('/programs', data).then((res) => res.data),
    update: (id: string, data: any) => apiClient.patch(`/programs/${id}`, data).then((res) => res.data),
    delete: (id: string) => apiClient.delete(`/programs/${id}`).then((res) => res.data),
  },
  analytics: {
    getLandingStats: (days: number = 30) => apiClient.get(`/analytics/landing-stats?days=${days}`).then((res) => res.data),
    getCourseFunnel: (days: number = 30, courseId?: string) =>
      apiClient.get(`/analytics/course-funnel?days=${days}${courseId ? `&courseId=${courseId}` : ''}`).then((res) => res.data),
    getCountryBreakdown: (days: number = 30) => apiClient.get(`/analytics/country-breakdown?days=${days}`).then((res) => res.data),
    getTopCourses: (days: number = 30) => apiClient.get(`/analytics/top-courses?days=${days}`).then((res) => res.data),
    getPopularTypes: (days: number = 30) => apiClient.get(`/analytics/popular-types?days=${days}`).then((res) => res.data),
    track: (events: Array<{ eventType: string; courseId?: string; country?: string }>) =>
      apiClient.post('/analytics/track', { events }).then((res) => res.data),
  },
  compliance: {
    getOverview: () => apiClient.get('/compliance/overview').then((res) => res.data),
    getCourses: () => apiClient.get('/compliance/courses').then((res) => res.data),
    getLearners: (courseId?: string) =>
      apiClient.get(`/compliance/learners${courseId ? `?courseId=${courseId}` : ''}`).then((res) => res.data),
    createCourse: (data: { title: string; description?: string; validityMonths?: number; gracePeriodDays?: number }) =>
      apiClient.post('/compliance/create-course', data).then((res) => res.data),
    waive: (courseId: string, userId: string) =>
      apiClient.post('/compliance/waive', { courseId, userId }).then((res) => res.data),
    reset: (courseId: string, userId: string) =>
      apiClient.post('/compliance/reset', { courseId, userId }).then((res) => res.data),
  },
  dash: {
    getStats: (workspaceId?: string) =>
      apiClient.get(`/dash/stats${workspaceId ? `?workspaceId=${workspaceId}` : ''}`).then((res) => res.data),
    getRecentCertifications: (workspaceId?: string) =>
      apiClient.get(`/dash/recent-certifications${workspaceId ? `?workspaceId=${workspaceId}` : ''}`).then((res) => res.data),
    getLoginActivity: (workspaceId?: string) =>
      apiClient.get(`/dash/login-activity${workspaceId ? `?workspaceId=${workspaceId}` : ''}`).then((res) => res.data),
  },
  audience: {
    getMembers: (search?: string, role?: string) =>
      apiClient.get(`/audience/members${search || role ? `?${new URLSearchParams({ ...(search ? { search } : {}), ...(role ? { role } : {}) }).toString()}` : ''}`).then((res) => res.data),
    inviteMember: (email: string, role: string) =>
      apiClient.post('/audience/invite', { email, role }).then((res) => res.data),
    getPendingInvites: () =>
      apiClient.get('/audience/invites').then((res) => res.data),
    revokeInvite: (id: string) =>
      apiClient.delete(`/audience/invites/${id}`).then((res) => res.data),
    removeMember: (userId: string) =>
      apiClient.delete(`/audience/members/${userId}`).then((res) => res.data),
    updateMemberRole: (userId: string, role: string) =>
      apiClient.patch(`/audience/members/${userId}/role`, { role }).then((res) => res.data),
    resetStudentProgress: (courseId: string, userId: string) =>
      apiClient.post('/audience/reset-progress', { courseId, userId }).then((res) => res.data),
  },
  tags: {
    getGroups: () => apiClient.get('/tags/groups').then((res) => res.data),
    createGroup: (data: { name: string; description?: string; selectionMode?: string }) =>
      apiClient.post('/tags/groups', data).then((res) => res.data),
    updateGroup: (id: string, data: { name?: string; description?: string; selectionMode?: string }) =>
      apiClient.put(`/tags/groups/${id}`, data).then((res) => res.data),
    deleteGroup: (id: string) => apiClient.delete(`/tags/groups/${id}`).then((res) => res.data),
    getTags: (groupId?: string) =>
      apiClient.get(`/tags${groupId ? `?groupId=${groupId}` : ''}`).then((res) => res.data),
    createTag: (data: { name: string; color?: string; description?: string; groupId?: string }) =>
      apiClient.post('/tags', data).then((res) => res.data),
    updateTag: (id: string, data: { name?: string; color?: string; description?: string; groupId?: string }) =>
      apiClient.put(`/tags/${id}`, data).then((res) => res.data),
    deleteTag: (id: string) => apiClient.delete(`/tags/${id}`).then((res) => res.data),
    assignTag: (courseId: string, tagId: string) =>
      apiClient.post(`/tags/courses/${courseId}/tags/${tagId}`).then((res) => res.data),
    removeTag: (courseId: string, tagId: string) =>
      apiClient.delete(`/tags/courses/${courseId}/tags/${tagId}`).then((res) => res.data),
  },
  media: {
    getStorage: () => apiClient.get('/media/storage').then((res) => res.data),
    findAll: (type?: string) => apiClient.get(`/media${type ? `?type=${type}` : ''}`).then((res) => res.data),
    create: (data: { filename: string; url: string; mimeType: string; size: number }) =>
      apiClient.post('/media', data).then((res) => res.data),
    delete: (id: string) => apiClient.delete(`/media/${id}`).then((res) => res.data),
  },
  widgets: {
    findAll: () => apiClient.get('/widgets').then((res) => res.data),
    findOne: (id: string) => apiClient.get(`/widgets/${id}`).then((res) => res.data),
    create: (data: { name: string; theme?: string; layout?: string; primaryColor?: string; courseIds?: string[] }) =>
      apiClient.post('/widgets', data).then((res) => res.data),
    update: (id: string, data: { name?: string; theme?: string; layout?: string; primaryColor?: string; courseIds?: string[] }) =>
      apiClient.put(`/widgets/${id}`, data).then((res) => res.data),
    delete: (id: string) => apiClient.delete(`/widgets/${id}`).then((res) => res.data),
    getPublicEmbed: (id: string) => apiClient.get(`/widgets/embed/${id}`).then((res) => res.data),
  },
};
