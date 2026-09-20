import type { Plugin } from "vite";
import type { Board, Task } from "../types.ts";
import seed from "../data/seed.json" with { type: "json" };

type BoardStore = Record<string, Board>;

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
 * intercept. State resets on every request that carries a fresh seed, which
 * keeps parallel tests isolated without a database.
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
          res.end(JSON.stringify(payload));
        };

        if (url.pathname === "/api/reset" && req.method === "POST") {
          boards = loadSeed();
          return send(200, { ok: true });
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
          const task = board?.tasks.find((t) => t.id === taskMatch[2]);
          if (!task) return send(404, { error: "Task not found" });

          if (req.method === "PATCH") {
            const input = JSON.parse((await readBody(req)) || "{}");
            if ("title" in input) {
              if (!String(input.title).trim()) {
                return send(400, { error: "Title is required" });
              }
              task.title = String(input.title).trim();
            }
            if ("status" in input) task.status = input.status;
            if ("description" in input) task.description = input.description;
            if ("tags" in input) task.tags = input.tags;
            return send(200, task);
          }

          if (req.method === "DELETE") {
            board.tasks = board.tasks.filter((t) => t.id !== task.id);
            return send(204, null);
          }
        }

        return send(404, { error: "Not found" });
      });
    },
  };
}
