import { Hono } from "hono";
import { cors } from "hono/cors";
import { getFileFormat } from "../../../utils";

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
        type: getFileFormat(file.type),
      };
    }

    return {
      name: fileName,
      data: file,
      type: "unknown",
    };
  });

  for (const file of filesArray) {
    const filePath = `${uploadPath}/${file.name}`;

    // TODO: Upload only new ones and skip existing ones
    // if (await Bun.file(filePath).exists()) {
    //   return c.text(`${file.name} already exists`);
    // }

    await Bun.write(filePath, file.data);
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

media.use(
  "/upload",
  cors({
    origin: ["*", "http://localhost:5173"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: false,
  }),
);

export default media;
