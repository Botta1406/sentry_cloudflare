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
      console.log("📥 Fetching all todos...");
      Sentry.logger.info("Fetching all todos");

      const response = await apiClient.get<ApiResponse<Todo[]>>("/api/todos");
      const todos = response.data.data || [];

      console.log(`✅ Successfully fetched ${todos.length} todos`);
      Sentry.logger.info(`Successfully fetched ${todos.length} todos`);

      return todos;
    } catch (error) {
      console.error("❌ Error fetching todos:", error);
      Sentry.logger.error("Error fetching todos", { error });
      Sentry.captureException(error, {
        tags: { endpoint: "/api/todos", action: "fetch" },
      });
      throw error;
    }
  },

  async getTodo(id: string): Promise<Todo> {
    try {
      console.log(`📥 Fetching todo: ${id}`);
      Sentry.logger.info(`Fetching todo: ${id}`);

      const response = await apiClient.get<ApiResponse<Todo>>(`/api/todos/${id}`);
      const todo = response.data.data!;

      console.log(`✅ Successfully fetched todo: ${todo.title}`);
      Sentry.logger.info(`Successfully fetched todo: ${todo.title}`);

      return todo;
    } catch (error) {
      console.error(`❌ Error fetching todo ${id}:`, error);
      Sentry.logger.error(`Error fetching todo ${id}`, { error });
      Sentry.captureException(error, {
        tags: { endpoint: `/api/todos/${id}`, action: "fetch" },
      });
      throw error;
    }
  },

  async createTodo(request: CreateTodoRequest): Promise<Todo> {
    try {
      console.log(`🆕 Creating new todo: "${request.title}"`);
      Sentry.logger.info(`Creating new todo: "${request.title}"`);

      const response = await apiClient.post<ApiResponse<Todo>>(
        "/api/todos",
        request
      );
      const todo = response.data.data!;

      console.log(`✅ Successfully created todo: ${todo.id} - "${todo.title}"`);
      Sentry.logger.info(`Successfully created todo: "${todo.title}"`);

      return todo;
    } catch (error) {
      console.error(`❌ Error creating todo:`, error);
      Sentry.logger.error("Error creating todo", { error });
      Sentry.captureException(error, {
        tags: { endpoint: "/api/todos", action: "create" },
      });
      throw error;
    }
  },

  async updateTodo(id: string, request: UpdateTodoRequest): Promise<Todo> {
    try {
      const action = request.completed !== undefined ? "toggled" : "updated";
      console.log(`✏️ ${action === "toggled" ? "Toggling" : "Updating"} todo: ${id}`);
      Sentry.logger.info(`${action === "toggled" ? "Toggling" : "Updating"} todo: ${id}`);

      const response = await apiClient.put<ApiResponse<Todo>>(
        `/api/todos/${id}`,
        request
      );
      const todo = response.data.data!;

      console.log(`✅ Successfully ${action} todo: "${todo.title}" (completed: ${todo.completed})`);
      Sentry.logger.info(`Successfully ${action} todo: "${todo.title}"`);

      return todo;
    } catch (error) {
      console.error(`❌ Error updating todo ${id}:`, error);
      Sentry.logger.error(`Error updating todo ${id}`, { error });
      Sentry.captureException(error, {
        tags: { endpoint: `/api/todos/${id}`, action: "update" },
      });
      throw error;
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting todo: ${id}`);
      Sentry.logger.info(`Deleting todo: ${id}`);

      await apiClient.delete(`/api/todos/${id}`);

      console.log(`✅ Successfully deleted todo: ${id}`);
      Sentry.logger.info("Successfully deleted todo");
    } catch (error) {
      console.error(`❌ Error deleting todo ${id}:`, error);
      Sentry.logger.error(`Error deleting todo ${id}`, { error });
      Sentry.captureException(error, {
        tags: { endpoint: `/api/todos/${id}`, action: "delete" },
      });
      throw error;
    }
  },
};