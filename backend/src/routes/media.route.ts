import { Hono } from "hono";
import { cors } from "hono/cors";
import { writeFiles } from "../services/media.service";

const media = new Hono();

media.use(
  "/upload",
  cors({
    origin: ["*", "http://localhost:5173"],
    allowHeaders: ["X-Custom-Header", "Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  }),
);

media.get("/", (c) => c.json({ message: "Hello, Media!" }));

media.get("/id/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`You requested media with id: ${id}`);
});

media.post("/upload", async (c) => {
  const files = await c.req.parseBody();
  try {
    return await writeFiles(files, c);
  } catch (error) {
    return c.text("Error uploading files");
  }
});

export default media;
