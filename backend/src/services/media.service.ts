// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
import { type BunFile, Glob } from "bun";
import { getFileFormat, getFileName } from "../../../utils";
import { API_UPLOAD_PATH } from "../../../utils/constants.ts";
import type { CustomFileType, WriteFilesTypes } from "../types.ts";

export default class MediaService {
  constructor() {}

  public writeFiles = async ({ files, ctx }: WriteFilesTypes) => {
    const uploadPath = Bun.env.UPLOAD_PATH || API_UPLOAD_PATH;
    const filesArray = this.getFilesArray(files);

    for await (const file of filesArray) {
      const filePath = `${uploadPath}/${file.name}`;

      if (await Bun.file(filePath).exists()) {
        filesArray.splice(filesArray.indexOf(file), 1);
        return ctx.text(`${getFileName(file.name)} already exists`);
      }

      await Bun.write(filePath, file.data);
    }

    return ctx.json(
      filesArray.map((file) => ({
        name: file.name,
        type: file.type,
      })),
    );
  };

  public getSingleFileFromUploads = async (fileName: string) => {
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

    return await arrayFromGlob(glob);
  };

  private getFilesArray = (files: BodyData): CustomFileType[] =>
    Object.keys(files).map((fileName) => {
      const file = files[fileName];

      if (file instanceof File) {
        console.log("file instanceof File");
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
}
