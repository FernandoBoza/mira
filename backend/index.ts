import { Hono } from "hono";
import mediaRoute from "./routes/media.route.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.route("/media", mediaRoute);

Bun.serve({
  fetch: app.fetch,
  port: Bun.env.PORT,
});
