import { Hono } from "hono";
import { cors } from "hono/cors";
import mediaRoute from "./src/routes/media.route.ts";
import { CORS, PORT } from "../utils/constants.ts";

const app = new Hono();

app.use("*", cors(CORS));

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.route("/media", mediaRoute);

Bun.serve({
  fetch: app.fetch,
  port: Bun.env.PORT || PORT,
});

console.log(`Listening on http://localhost:${Bun.env.PORT || PORT} 😊`);
