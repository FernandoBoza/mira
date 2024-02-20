import { Hono } from "hono";

const media = new Hono();

media.get("/", (c) => c.json({ message: "Hello, Media!" }));

media.get("/id/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`You requested media with id: ${id}`);
});

media.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body.image;

  console.log(file);

  if (!file) {
    return c.text("No files were uploaded");
  }

  await Bun.write("./uploads/profilePicture.jpg", file);
  return c.json({ files: file });
});

export default media;
