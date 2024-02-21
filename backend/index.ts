import { Hono } from "hono";
import { cors } from "hono/cors";
import mediaRoute from "./src/routes/media.route.ts";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["*", "http://localhost:5173"],
    allowHeaders: ["X-Custom-Header", "Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  }),
);

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.route("/media", mediaRoute);

Bun.serve({
  fetch: app.fetch,
  port: Bun.env.PORT,
});

console.log(`Listening on http://localhost:${Bun.env.PORT} 😊`);
