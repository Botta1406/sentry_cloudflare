"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/lib/types";
import { todoAPI } from "@/lib/api-client";
import TodoItem from "./TodoItem";
import TodoInput from "./TodoInput";
import * as Sentry from "@sentry/nextjs";

type FilterType = "all" | "todo" | "in-progress" | "done";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  // Initialize Sentry user context on mount
  useEffect(() => {
    // Set user context for better error tracking
    Sentry.setUser({
      id: "todo-user",
      username: "todoapps-user",
    });

    // Add breadcrumb for app initialization
    Sentry.captureMessage("Todo app initialized", "info");
  }, []);

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await todoAP.getAllTodos();
        setTodos(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch todos";
        setError(message);
        Sentry.captureException(err, {
          tags: { component: "TodoList", action: "fetch" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string) => {
    try {
      setLoading(true);
      const newTodo = await todoAPI.createTodo({ title });
      setTodos([...todos, newTodo]);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create todo";
      setError(message);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const updatedTodo = await todoAPI.updateTodo(id, { completed });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update todo";
      setError(message);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setLoading(true);
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete todo";
      setError(message);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const todoCount = todos.filter((t) => !t.completed).length;
  const inProgressCount = 0; // For now, all non-completed are "to-do"

  const filteredTodos = todos;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - Minimalist */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-500 text-sm tracking-wide uppercase">Organize your work</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-gray-100 border-l border-gray-400 rounded">
            <div className="flex items-start gap-3">
              <div className="text-lg">⚠️</div>
              <div>
                <p className="text-gray-800 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Card - Minimalist */}
        <TodoInput onAdd={handleAddTodo} loading={loading} />

        {/* Stats Row */}
        <div className="flex justify-between items-center mb-8 border-t border-gray-200 pt-6">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">Tasks</p>
            <p className="text-3xl font-light text-gray-900">{todos.length}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">Completed</p>
            <p className="text-3xl font-light text-gray-900">{completedCount}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">Remaining</p>
            <p className="text-3xl font-light text-gray-900">{todos.length - completedCount}</p>
          </div>
        </div>

        {/* Todos List - Minimalist */}
        <div className="space-y-2">
          {loading && todos.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border border-gray-300 border-t-gray-900"></div>
              <p className="text-gray-600 mt-4 text-sm">Loading tasks...</p>
            </div>
          )}

          {!loading && filteredTodos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No tasks yet. Add one to get started.</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                loading={loading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}