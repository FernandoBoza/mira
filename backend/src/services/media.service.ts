// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
import type { Context, Env } from "hono";
import type { BlankInput } from "hono/types";
import { type BunFile, Glob } from "bun";
import { getFileFormat, getFileName } from "../../../utils";
import {
  API_UPLOAD_ENDPOINT,
  LOCAL_UPLOAD_PATH,
} from "../../../utils/constants.ts";

export const writeFiles = async (
  files: BodyData,
  ctx: Context<Env, typeof API_UPLOAD_ENDPOINT, BlankInput>,
) => {
  const uploadPath = Bun.env.UPLOAD_PATH || LOCAL_UPLOAD_PATH;

  if (!files) return ctx.text("No files were uploaded");

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

export const getSingleFileFromUploads = async () => {
  const uploadPath = Bun.env.UPLOAD_PATH || LOCAL_UPLOAD_PATH;
  const glob = new Glob("**/*");
  const arrayFromGlob = async (glob: Glob) => {
    const files: BunFile[] = [];
    for await (const file of glob.scan({ cwd: uploadPath, onlyFiles: true })) {
      files.push(Bun.file(`${uploadPath}/${file}`));
    }
    return files;
  };

  return await arrayFromGlob(glob);
};
