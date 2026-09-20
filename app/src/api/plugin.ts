import type { Plugin } from "vite";
import type { Board, Task } from "../types.ts";
import seed from "../data/seed.json" with { type: "json" };

type BoardStore = Record<string, Board>;

const CREDENTIALS = { username: "admin", password: "password123" };
const PROFILE = { username: "admin", name: "Ada Cole" };

function loadSeed(): BoardStore {
  return JSON.parse(JSON.stringify(seed)) as BoardStore;
}

function readBody(req: import("node:http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

/**
 * Serves the board API from memory so the suite has a real network layer to
 * intercept. Sign in returns a token that later requests must present, which
 * gives the auth setup project something to store and reuse.
 */
export function boardApi(): Plugin {
  let boards = loadSeed();

  return {
    name: "board-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "/", "http://localhost");
        if (!url.pathname.startsWith("/api/")) return next();

        res.setHeader("Content-Type", "application/json");
        const send = (status: number, payload: unknown) => {
          res.statusCode = status;
          res.end(payload === null ? "" : JSON.stringify(payload));
        };

        if (url.pathname === "/api/session" && req.method === "POST") {
          const input = JSON.parse((await readBody(req)) || "{}");
          if (
            input.username !== CREDENTIALS.username ||
            input.password !== CREDENTIALS.password
          ) {
            return send(401, { error: "Invalid username or password" });
          }
          return send(200, { token: "demo-session-token", user: PROFILE });
        }

        if (url.pathname === "/api/reset" && req.method === "POST") {
          boards = loadSeed();
          return send(200, { ok: true });
        }

        if (req.headers.authorization !== "Bearer demo-session-token") {
          return send(401, { error: "Not authenticated" });
        }

        const boardMatch = url.pathname.match(/^\/api\/boards\/([\w-]+)$/);
        if (boardMatch) {
          const board = boards[boardMatch[1]];
          if (!board) return send(404, { error: "Board not found" });

          if (req.method === "GET") return send(200, board);

          if (req.method === "POST") {
            const input = JSON.parse((await readBody(req)) || "{}");
            if (!input.title || !String(input.title).trim()) {
              return send(400, { error: "Title is required" });
            }
            const task: Task = {
              id: `${board.id}-${Date.now()}`,
              title: String(input.title).trim(),
              description: String(input.description || ""),
              status: input.status || "To Do",
              tags: Array.isArray(input.tags) ? input.tags : [],
              assignee: input.assignee || PROFILE.name,
            };
            board.tasks.push(task);
            return send(201, task);
          }
        }

        const taskMatch = url.pathname.match(
          /^\/api\/boards\/([\w-]+)\/tasks\/([\w-]+)$/,
        );
        if (taskMatch) {
          const board = boards[taskMatch[1]];
          const task = board?.tasks.find((item) => item.id === taskMatch[2]);
          if (!task) return send(404, { error: "Task not found" });

          if (req.method === "PATCH") {
            const input = JSON.parse((await readBody(req)) || "{}");
            if ("title" in input && !String(input.title).trim()) {
              return send(400, { error: "Title is required" });
            }
            Object.assign(task, input);
            return send(200, task);
          }

          if (req.method === "DELETE") {
            board.tasks = board.tasks.filter((item) => item.id !== task.id);
            return send(204, null);
          }
        }

        return send(404, { error: "Not found" });
      });
    },
  };
}
