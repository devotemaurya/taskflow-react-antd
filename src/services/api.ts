import axios from 'axios';

// Mock mode for demo purposes
const MOCK_MODE = !import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Mock data for demo
let mockTasks: Task[] = [
  {
    id: '1',
    name: 'Test React App',
    command: 'npm test',
    description: 'Run unit tests for the React application',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2', 
    name: 'Build Production',
    command: 'npm run build',
    description: 'Create optimized production build',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

// API functions with mock mode fallback
export const taskApi = {
  // Get all tasks with optional name filter
  getTasks: async (name?: string): Promise<Task[]> => {
    if (MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return name ? mockTasks.filter(task => task.name.toLowerCase().includes(name.toLowerCase())) : mockTasks;
    }
    const params = name ? { name } : {};
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  // Create a new task
  createTask: async (taskData: TaskCreateRequest): Promise<Task> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newTask: Task = {
        id: Date.now().toString(),
        name: taskData.name,
        command: taskData.command,
        description: taskData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockTasks.unshift(newTask);
      return newTask;
    }
    const response = await api.put<Task>('/tasks', taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockTasks = mockTasks.filter(task => task.id !== id);
      return;
    }
    await api.delete(`/tasks/${id}`);
  },

  // Execute a task
  executeTask: async (id: string): Promise<TaskExecutionResponse> => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const task = mockTasks.find(t => t.id === id);
      return {
        output: `Executing: ${task?.command || 'unknown command'}\n✅ Command completed successfully\nExit code: 0`,
        exitCode: 0,
        executedAt: new Date().toISOString(),
      };
    }
    const response = await api.put<TaskExecutionResponse>(`/tasks/${id}/execution`);
    return response.data;
  },
};

export default api;