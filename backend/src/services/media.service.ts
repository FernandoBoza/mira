// @ts-ignore
import type { HonoRequest } from "hono/dist/types/request";
// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
import { type BunFile, Glob } from "bun";
import { getFileFormat, getFileName } from "../../../utils";
import { API_UPLOAD_PATH } from "../../../utils/constants.ts";
import type { CustomFileType, WriteFilesTypes } from "../types.ts";
import { appendFile } from "node:fs/promises";

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

  // public async appendChunksToFile(chunks, filePath) {
  //   for (const chunk of chunks) {
  //     await appendFile(filePath, chunk);
  //   }
  // }

  assembleStream = async (req: HonoRequest) => {
    try {
      // const appendChunksToFile = async (chunks, filePath) => {
      //   for (const chunk of chunks) {
      //     await appendFile(filePath, chunk);
      //   }
      // };
      const writer = new Bun.ArrayBufferSink();

      const stream = new ReadableStream({
        async pull(controller) {
          // Assuming 'req.body' is a ReadableStream of the sliced video data
          for await (const chunk of req.body) {
            // Write each chunk to the ArrayBufferSink
            writer.write(chunk);
          }

          // await appendChunksToFile(req.body, API_UPLOAD_PATH);
          for (const chunk of req.body) {
            await appendFile(API_UPLOAD_PATH, chunk);
          }

          writer.end(); // Call when all chunks have been written
          controller.close();
        },
      });

      // The following line is hypothetical and depends on how you want to handle the full binary data
      // Here we assume you want to save it to a file
      // await Bun.write(API_UPLOAD_PATH, writer);

      return new Response("Video upload complete.");

      // The path where the video file will be saved

      // Assuming the body of the request is a ReadableStream of Uint8Array
      // const reader = req.body.getReader();
      // let chunks = [];
      //
      // // Read from the stream and collect chunks
      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;
      //   chunks.push(value);
      // }
      //
      // // Concatenate all Uint8Array chunks into a single Uint8Array
      // let videoData = new Uint8Array(
      //   chunks.reduce((acc, val) => acc + val.byteLength, 0),
      // );
      // let offset = 0;
      // for (let chunk of chunks) {
      //   videoData.set(chunk, offset);
      //   offset += chunk.byteLength;
      // }
      //
      // // Write the Uint8Array to file
      // Bun.file(API_UPLOAD_PATH, new Blob([videoData]));
      //
      // return new Response("Video uploaded and saved successfully.");
    } catch (e) {
      // Handle other requests or return a 404
      return new Response("Not Found", { status: 404 });
    }
  };

  private getFilesArray = (files: BodyData): CustomFileType[] =>
    Object.keys(files).map((fileName) => {
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
}
