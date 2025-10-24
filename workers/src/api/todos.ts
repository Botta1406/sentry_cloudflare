import { IRequest, Env, Todo, ApiResponse } from "../types";
import { v4 as uuidv4 } from "uuid";

export class TodoAPI {
  private kv: KVNamespace;

  constructor(kv?: KVNamespace) {
    // For local development, KV will be provided by the context
    this.kv = kv!;
  }

  async getAll(req: IRequest, env?: Env): Promise<Response> {
    try {
      const todos: Todo[] = [];

      // List all keys in KV
      const list = await env!.TODOS.list();

      for (const key of list.keys) {
        const todo = await env!.TODOS.get(key.name, "json") as Todo;
        if (todo) {
          todos.push(todo);
        }
      }

      // Sort by createdAt descending
      todos.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return this.jsonResponse({ success: true, data: todos });
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async getById(req: IRequest, env?: Env): Promise<Response> {
    try {
      const id = req.params?.id;
      if (!id) {
        return this.errorResponse("Todo ID is required", 400);
      }

      const todo = await env!.TODOS.get(id, "json") as Todo;
      if (!todo) {
        return this.errorResponse("Todo not found", 404);
      }

      return this.jsonResponse({ success: true, data: todo });
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async create(req: IRequest, env?: Env): Promise<Response> {
    try {
      const body = await req.json() as { title: string };

      if (!body.title || !body.title.trim()) {
        return this.errorResponse("Title is required", 400);
      }

      const todo: Todo = {
        id: uuidv4(),
        title: body.title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await env!.TODOS.put(todo.id, JSON.stringify(todo));

      return this.jsonResponse({ success: true, data: todo }, 201);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async update(req: IRequest, env?: Env): Promise<Response> {
    try {
      const id = req.params?.id;
      if (!id) {
        return this.errorResponse("Todo ID is required", 400);
      }

      const todo = await env!.TODOS.get(id, "json") as Todo;
      if (!todo) {
        return this.errorResponse("Todo not found", 404);
      }

      const body = await req.json() as { title?: string; completed?: boolean };

      if (body.title !== undefined) {
        if (!body.title.trim()) {
          return this.errorResponse("Title cannot be empty", 400);
        }
        todo.title = body.title.trim();
      }

      if (body.completed !== undefined) {
        todo.completed = body.completed;
      }

      todo.updatedAt = new Date().toISOString();

      await env!.TODOS.put(id, JSON.stringify(todo));

      return this.jsonResponse({ success: true, data: todo });
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async delete(req: IRequest, env?: Env): Promise<Response> {
    try {
      const id = req.params?.id;
      if (!id) {
        return this.errorResponse("Todo ID is required", 400);
      }

      const todo = await env!.TODOS.get(id, "json");
      if (!todo) {
        return this.errorResponse("Todo not found", 404);
      }

      await env!.TODOS.delete(id);

      return this.jsonResponse({ success: true });
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  private jsonResponse<T>(
    data: ApiResponse<T>,
    status = 200
  ): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private errorResponse(error: any, status = 500): Response {
    const message = error instanceof Error ? error.message : String(error);
    return this.jsonResponse({ success: false, error: message }, status);
  }
}