import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from "./types";

const API_BASE_URL =
  typeof window !== "undefined" && (window as any).__API_URL__
    ? (window as any).__API_URL__
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Sentry error tracking to API calls
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

export const todoAPI = {
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await apiClient.get<ApiResponse<Todo[]>>("/api/todos");
      return response.data.data || [];
    } catch (error) {
      Sentry.captureException(error, {
        tags: { endpoint: "/api/todos" },
      });
      throw error;
    }
  },

  async getTodo(id: string): Promise<Todo> {
    try {
      const response = await apiClient.get<ApiResponse<Todo>>(`/api/todos/${id}`);
      return response.data.data!;
    } catch (error) {
      Sentry.captureException(error, {
        tags: { endpoint: `/api/todos/${id}` },
      });
      throw error;
    }
  },

  async createTodo(request: CreateTodoRequest): Promise<Todo> {
    try {
      const response = await apiClient.post<ApiResponse<Todo>>(
        "/api/todos",
        request
      );
      return response.data.data!;
    } catch (error) {
      Sentry.captureException(error, {
        tags: { endpoint: "/api/todos", action: "create" },
      });
      throw error;
    }
  },

  async updateTodo(id: string, request: UpdateTodoRequest): Promise<Todo> {
    try {
      const response = await apiClient.put<ApiResponse<Todo>>(
        `/api/todos/${id}`,
        request
      );
      return response.data.data!;
    } catch (error) {
      Sentry.captureException(error, {
        tags: { endpoint: `/api/todos/${id}`, action: "update" },
      });
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/todos/${id}`);
    } catch (error) {
      Sentry.captureException(error, {
        tags: { endpoint: `/api/todos/${id}`, action: "delete" },
      });
      throw error;
    }
  },
};