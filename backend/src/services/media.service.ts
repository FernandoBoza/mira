// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
// @ts-ignore
import type { BlankInput } from "hono/dist/types/types";
import type { Context, Env } from "hono";
import { type BunFile, Glob } from "bun";
import { appendFile } from "fs/promises";
import { getFileFormat, getFileName } from "../../../utils";
import type { CustomFileType, FileError } from "../types.ts";
import {
  API_UPLOAD_ENDPOINT,
  API_UPLOAD_PATH,
} from "../../../utils/constants.ts";

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

  public writeFiles = async (
    c: Context<Env, typeof API_UPLOAD_ENDPOINT, BlankInput>,
    isLargeFile?: boolean,
  ): Promise<Response> => {
    const uploadPath = Bun.env.UPLOAD_PATH || API_UPLOAD_PATH;
    const filesArray = this.getFilesArray(await c.req.parseBody());
    const doesFileExist = async (filePath: string) =>
      await Bun.file(filePath).exists();

    if (isLargeFile) {
      for await (const file of filesArray) {
        const filePath = `${uploadPath}/${file.name}`;

        if (await doesFileExist(filePath)) {
          filesArray.splice(filesArray.indexOf(file), 1);
          return c.text(`${getFileName(file.name)} already exists`);
        }

        if (file.data instanceof File) {
          const byteArray = new Uint8Array(await file.data.arrayBuffer());
          const filePath = `${API_UPLOAD_PATH}/${file.fileName}`;
          await appendFile(filePath, byteArray);
        }
      }
      return c.text("Uploaded large files");
    } else {
      for await (const file of filesArray) {
        const filePath = `${uploadPath}/${file.name}`;

        if (await doesFileExist(filePath)) {
          filesArray.splice(filesArray.indexOf(file), 1);
          return c.text(`${getFileName(file.name)} already exists`);
        }
        await Bun.write(filePath, file.data);
      }
      return c.text("Uploaded large files");
    }
  };

  public handleFileError = async (
    c: Context<Env, typeof API_UPLOAD_ENDPOINT, BlankInput>,
    e: unknown,
  ): Promise<FileError> => {
    const fileName = await c.req
      .parseBody()
      .then((res) => res.fileName as string);

    const errorMessage = `Error uploading file ${fileName}`;

    console.log(errorMessage, e);
    return { fileName, errorMessage, errorDetails: e };
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
