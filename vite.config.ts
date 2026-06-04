import { exec } from "node:child_process";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), refreshIssuesPlugin()]
});

function refreshIssuesPlugin(): Plugin {
  return {
    name: "refresh-issues-api",
    configureServer(server) {
      server.middlewares.use("/api/refresh", (request, response, next) => {
        if (request.method !== "POST") {
          next();
          return;
        }

        exec("npm run fetch", { cwd: process.cwd() }, (error, stdout, stderr) => {
          response.setHeader("content-type", "application/json; charset=utf-8");

          if (error) {
            response.statusCode = 500;
            response.end(JSON.stringify({ ok: false, stdout, stderr }));
            return;
          }

          response.end(JSON.stringify({ ok: true, stdout }));
          server.ws.send({ type: "full-reload" });
        });
      });
    }
  };
}
