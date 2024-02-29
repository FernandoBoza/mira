// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body"; // @ts-ignore
import path from "path";
import { appendFile, mkdir } from "fs/promises";
import { getFileFormat } from "../../../utils";
import type { CustomContext, CustomFileType, FileError } from "../types.ts";
import { API_UPLOAD_PATH } from "../../../utils/constants.ts";

export default class MediaService {
  constructor() {}

  public getSingleFileFromUploads = async <P extends string>(
    c: CustomContext<P>,
  ) => {
    // @ts-ignore
    const fileName = c.req.param("fileName");
    const uploadPath = Bun.env.UPLOAD_PATH || API_UPLOAD_PATH;
    const file = Bun.file(`${uploadPath}/${fileName}`);
    return (await file.exists()) ? file : false;
  };

  /**
   * This method is used to write files to the server. It can handle both large and small files.
   * It first checks if the file already exists on the server. If it does, it removes the file from the filesArray and returns a message indicating that the file already exists.
   * If the file does not exist, it checks if the file is a large file. If it is, it converts the file data to a Uint8Array and writes it to the server.
   * If the file is not a large file, it writes the file data directly to the server.
   * After all files have been processed, it returns a message indicating that the files have been uploaded.
   *
   * @param {CustomContext<P extends string>} c - The context object which includes the request and response objects.
   * @param {boolean} [isLargeFile] - A flag indicating whether the file is a large file.
   * @returns {Promise<Response>} A promise that resolves to a response object. The response object includes a message indicating the result of the file upload operation.
   */
  public writeFiles = async <P extends string>(
    c: CustomContext<P>,
    isLargeFile?: boolean,
  ): Promise<Response> => {
    const filesArray = this.getFilesArray(await c.req.parseBody());
    const doesFileExist = async (filePath: string) =>
      await Bun.file(filePath).exists();

    if (isLargeFile) {
      for await (const file of filesArray) {
        const filePath = `${API_UPLOAD_PATH}/${file.fileName}`;

        if (await doesFileExist(filePath)) {
          filesArray.splice(filesArray.indexOf(file), 1);
          break;
        } else if (file.data instanceof File) {
          const byteArray = new Uint8Array(await file.data.arrayBuffer());
          const dirExist = (path: string) =>
            !!Array.from(new Bun.Glob(path).scanSync({ onlyFiles: false }))[0];

          if (!dirExist(filePath)) {
            const dir = path.dirname(filePath);
            await mkdir(dir, { recursive: true });
          }
          // await appendFile(filePath, byteArray);
        }
      }
      const lastChunk = filesArray.filter(
        (file) => file.name === "fileIsLastChunk" && file?.data === "true",
      )[0];

      if (lastChunk?.data === "true") {
        return c.text("Uploaded large files");
      } else {
        return c.text("Uploading ...");
      }
    } else {
      for await (const file of filesArray) {
        const filePath = `${API_UPLOAD_PATH}/${file.fileName}`;

        if (await doesFileExist(filePath)) {
          filesArray.splice(filesArray.indexOf(file), 1);
          break;
        } else {
          // await Bun.write(filePath, file.data);
        }
      }
      return c.text("Uploaded files");
    }
  };

  public handleUploadError = async <P extends string>(
    c: CustomContext<P>,
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
