"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

interface TodoInputProps {
  onAdd: (title: string) => void;
  loading?: boolean;
}

export default function TodoInput({ onAdd, loading = false }: TodoInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        onAdd(input.trim());
        setInput("");
      } catch (error) {
        Sentry.captureException(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:bg-white transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></span>
          ) : (
            "Add"
          )}
        </button>
      </div>
    </form>
  );
}