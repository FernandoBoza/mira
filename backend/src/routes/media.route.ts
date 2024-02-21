import { Glob } from "bun";
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

media.get("/files", async (c) => {
  const uploadPath = Bun.env.UPLOAD_PATH;
  const glob = new Glob("**/*");
  const arrayFromGlob = async (glob: Glob) => {
    const files = [];
    for await (const file of glob.scan({ cwd: uploadPath, onlyFiles: true })) {
      files.push(Bun.file(`${uploadPath}/${file}`));
    }
    return files;
  };

  const files = await arrayFromGlob(glob);

  return new Response(files[1]);
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
