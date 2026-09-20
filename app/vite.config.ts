import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { boardApi } from "./src/api/plugin.ts";

export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react(), boardApi()],
  server: {
    port: Number(process.env.APP_PORT) || 5173,
  },
});
