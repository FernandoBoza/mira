// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
import type { Context, Env } from "hono";
import type { BlankInput } from "hono/types";
import { getFileFormat, getFileName } from "../../../utils";
import { API_UPLOAD_ENDPOINT, LOCAL_UPLOAD_PATH } from "../../../utils/constants.ts";

// async function listFilesInDirectory(dirPath: string) {
//   try {
//     // The readdir method returns a Promise<string[]> indicating an array of file names
//     const files: string[] = await Bun.(dirPath);
//     console.log("Files and directories in:", dirPath);
//     files.forEach((file: string) => {
//       console.log(file);
//     });
//   } catch (error) {
//     console.error("Error listing files in directory:", error);
//   }
// }
//
// // Example usage
// const directoryPath: string = "./path/to/your/directory";
// listFilesInDirectory(directoryPath);
//
// const files = await readdir(import.meta.dir);

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

export const reassembleLargeFile = async (file: File) => {
  const chunkSize = 5242880; // 5MB
  const chunks = Math.ceil(file.size / chunkSize);
  const chunkPromises: Blob[] = [];

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);
    chunkPromises.push(chunk);
  }

  return Promise.all(chunkPromises);
};
