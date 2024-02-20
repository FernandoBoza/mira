import { Hono } from "hono";

const media = new Hono();

media.get("/", (c) => c.json({ message: "Hello, Media!" }));

media.get("/id/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`You requested media with id: ${id}`);
});

media.post("/upload", async (c) => {
  const files = await c.req.parseBody();
  const uploadPath = "./uploads";

  if (!files) {
    return c.text("No files were uploaded");
  }

  const filesArray = Object.keys(files).map((fileName) => {
    const file = files[fileName];

    if (file instanceof File) {
      return {
        name: fileName,
        data: file,
        type: file.type.split("/")[1],
      };
    }

    return {
      name: fileName,
      data: file,
      type: "unknown",
    };
  });

  for (const file of filesArray) {
    // TODO: Upload only new ones and skip existing ones
    if (await Bun.file(`${uploadPath}/${file.name}.${file.type}`).exists()) {
      return c.text(`${file.name} already exists`);
    }

    await Bun.write(`${uploadPath}/${file.name}.${file.type}`, file.data);
  }

  return c.json(
    filesArray.map((file) => {
      return {
        name: file.name,
        type: file.type,
      };
    }),
  );
});

export default media;
