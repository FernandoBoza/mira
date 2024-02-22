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
  const fileName = c.req.param("fileName");
  const files = await mediaService.getSingleFileFromUploads(fileName);
  try {
    return new Response(files[0]);
  } catch (error) {
    return c.text(`Looks like ${fileName} does not exist`);
  }
});

media.post(API_UPLOAD_ENDPOINT, async (c) => {
  const files = await c.req.parseBody();
  try {
    console.log("hitting small files endpoint");
    return await mediaService.writeFiles({ files, ctx: c });
  } catch (error) {
    return c.text("Error uploading files");
  }
});

media.post(`${API_UPLOAD_ENDPOINT}-large`, async (c) => {
  try {
    console.log("hitting large files endpoint");
    await mediaService.assembleStream(c);
  } catch (error) {
    const file = await c.req.parseBody();
    console.log(file);
    const prop = `Error uploading file ${file}`;
    return c.json({ [prop]: error });
  }

  return c.text("testing large files");
});

export default media;
