// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
// @ts-ignore
import type { BlankInput } from "hono/dist/types/types";
import type { Context, Env } from "hono";
import { type BunFile, Glob } from "bun";
import { getFileFormat, getFileName } from "../../../utils";
import {
  API_UPLOAD_ENDPOINT,
  API_UPLOAD_PATH,
} from "../../../utils/constants.ts";
import type { CustomFileType, WriteFilesTypes } from "../types.ts";
import { appendFile } from "fs/promises";

export default class MediaService {
  constructor() {}

  public getSingleFileFromUploads = async (
    c: Context<Env, "/file/:fileName", BlankInput>,
  ) => {
    const fileName = c.req.param("fileName");
    const uploadPath = Bun.env.UPLOAD_PATH || API_UPLOAD_PATH;
    const glob = new Glob("**/*");
    const arrayFromGlob = async (glob: Glob) => {
      const files: BunFile[] = [];
      for await (const file of glob.scan({
        cwd: uploadPath,
        onlyFiles: true,
      })) {
        if (file === fileName) {
          files.push(Bun.file(`${uploadPath}/${file}`));
        }
      }
      return files;
    };
    const file = [...(await arrayFromGlob(glob))][0];
    if (!file) throw new Error(`File ${fileName} not found`);
    return file;
  };

  public writeFiles = async ({ files, c }: WriteFilesTypes) => {
    const uploadPath = Bun.env.UPLOAD_PATH || API_UPLOAD_PATH;
    const filesArray = this.getFilesArray(files);

    for await (const file of filesArray) {
      const filePath = `${uploadPath}/${file.name}`;

      if (await Bun.file(filePath).exists()) {
        filesArray.splice(filesArray.indexOf(file), 1);
        return c.text(`${getFileName(file.name)} already exists`);
      }

      await Bun.write(filePath, file.data);
    }

    return c.json(
      filesArray.map((file) => ({
        name: file.name,
        type: file.type,
      })),
    );
  };

  public writeLargeFiles = async (
    c: Context<Env, typeof API_UPLOAD_ENDPOINT, BlankInput>,
  ) => {
    const arr = this.getFilesArray(await c.req.parseBody());

    for (const file of arr) {
      if (file.data instanceof File) {
        const byteArray = new Uint8Array(await file.data.arrayBuffer());
        const filePath = `${API_UPLOAD_PATH}/${file.fileName}`;

        // Wait for each file to be processed before moving on to the next
        await appendFile(filePath, byteArray);
      }
    }
    return c.text("Uploaded large files");
  };

  public handleFileError = async (
    c: Context<Env, typeof API_UPLOAD_ENDPOINT, BlankInput>,
    e: unknown,
  ) => {
    const fileName = await c.req.parseBody().then((res) => res.fileName);
    const fileWithError = `Error uploading file ${fileName}`;
    console.log(fileWithError, e);
    return c.json({ [fileWithError]: e });
  };

  private getFilesArray = (files: BodyData): CustomFileType[] =>
    Object.keys(files).map((fileName) => {
      const file = files[fileName];

      if (file instanceof File) {
        return {
          name: fileName,
          data: file,
          type: getFileFormat(file.type),
          fileName: file.name,
        };
      }

      return {
        name: fileName,
        data: file,
        type: "unknown",
      };
    });
}
