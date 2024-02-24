import { Hono } from "hono";
import MediaService from "../services/media.service";
import { API_UPLOAD_ENDPOINT } from "../../../utils/constants.ts";
import { HTTPException } from "hono/http-exception";

const media = new Hono();
const ms = new MediaService();

media.get("/", (c) => c.json({ message: "Hello, Media!" }));

media.get("/id/:id", (c) => {
  const id = c.req.param("id");
  return c.text(`You requested media with id: ${id}`);
});

media.get("/upload/file/:fileName", async (c) => {
  try {
    const file = await ms.getSingleFileFromUploads(c);
    return new Response(file);
  } catch (error) {
    console.error(error);
    throw new HTTPException(401, { message: error as string });
  }
});

media.post(API_UPLOAD_ENDPOINT, async (c) => {
  try {
    return await ms.writeFiles(c);
  } catch (e) {
    return c.json(ms.handleUploadError(c, e));
  }
});

media.post(`${API_UPLOAD_ENDPOINT}-large`, async (c) => {
  try {
    return await ms.writeFiles(c, true);
  } catch (e) {
    return c.json(ms.handleUploadError(c, e));
  }
});

export default media;
