"use client";

import { Todo } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  loading = false,
}: TodoItemProps) {
  const handleToggle = () => {
    try {
      onToggle(todo.id, !todo.completed);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleDelete = () => {
    try {
      onDelete(todo.id);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return (
    <div className={`group flex items-center gap-4 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
      todo.completed ? "opacity-60" : ""
    }`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={loading}
        className="w-5 h-5 rounded cursor-pointer bg-white border border-gray-400 accent-gray-900"
      />

      {/* Task Title */}
      <span
        className={`flex-1 transition-all ${
          todo.completed
            ? "line-through text-gray-400"
            : "text-gray-900"
        }`}
      >
        {todo.title}
      </span>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors opacity-0 group-hover:opacity-100"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}