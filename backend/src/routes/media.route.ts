import { Hono } from "hono";
import {
  getSingleFileFromUploads,
  writeFiles,
} from "../services/media.service";
import { API_UPLOAD_ENDPOINT } from "../../../utils/constants.ts";

const media = new Hono();

media.get("/", (c) => c.json({ message: "Hello, Media!" }));

media.get("/id/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`You requested media with id: ${id}`);
});

media.get("/files", async (c) => {
  const files = await getSingleFileFromUploads();
  try {
    return new Response(files[1]);
  } catch (error) {
    return c.text("Error getting files");
  }
});

media.post(API_UPLOAD_ENDPOINT, async (c) => {
  const files = await c.req.parseBody();
  try {
    return await writeFiles({ files, ctx: c });
  } catch (error) {
    return c.text("Error uploading files");
  }
});

export default media;
