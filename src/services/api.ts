import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Types for our task management system
export interface Task {
  id: string;
  name: string;
  command: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  name: string;
  command: string;
  description?: string;
}

export interface TaskExecutionResponse {
  output: string;
  exitCode: number;
  executedAt: string;
}

// API functions
export const taskApi = {
  // Get all tasks with optional name filter
  getTasks: async (name?: string): Promise<Task[]> => {
    const params = name ? { name } : {};
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: TaskCreateRequest): Promise<Task> => {
    const response = await api.put<Task>('/tasks', taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Execute a task
  executeTask: async (id: string): Promise<TaskExecutionResponse> => {
    const response = await api.put<TaskExecutionResponse>(`/tasks/${id}/execution`);
    return response.data;
  },
};

export default api;