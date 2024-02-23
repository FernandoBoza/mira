import { Hono } from "hono";
import MediaService from "../services/media.service";
import { API_UPLOAD_ENDPOINT } from "../../../utils/constants.ts";

const media = new Hono();
const mediaService = new MediaService();

media.get("/", (c) => c.json({ message: "Hello, Media!" }));

media.get("/id/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`You requested media with id: ${id}`);
});

media.get("/file/:fileName", async (c) => {
  try {
    const file = await mediaService.getSingleFileFromUploads(c);
    return new Response(file);
  } catch (error) {
    console.error(error);
    return c.text(`${error}`);
  }
});

media.post(API_UPLOAD_ENDPOINT, async (c) => {
  const files = await c.req.parseBody();
  try {
    return await mediaService.writeFiles({ files, c: c });
  } catch (e) {
    return c.json(mediaService.handleFileError(c, e));
  }
});

media.post(`${API_UPLOAD_ENDPOINT}-large`, async (c) => {
  try {
    return await mediaService.writeLargeFiles(c);
  } catch (e) {
    return c.json(mediaService.handleFileError(c, e));
  }
});

export default media;
