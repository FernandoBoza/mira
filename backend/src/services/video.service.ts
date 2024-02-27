import ffmpeg from "fluent-ffmpeg";
import { type BunFile } from "bun";
import type { VideoTypes } from "../types.ts";
import { formatBytes, getFileName } from "../../../utils";

const command = ffmpeg();
const pathToAssets = "./assets/";

export default class VideoService {
  constructor() {}

  static deconstructFile({ name, size, type }: BunFile) {
    return {
      name: getFileName(name),
      size: formatBytes(size),
      type,
    };
  }

  static convertVideo(
    fileName: string,
    output: string,
    type: VideoTypes = "mp4",
  ) {
    command
      .input(`${pathToAssets}${fileName}`)
      .output(`${pathToAssets}${output}.${type}`)
      .on("end", () => {
        console.log("Finished processing");
      })
      .run();
  }

  static async streamVideoFromCloud(url: string) {
    const response = await fetch(url);
    return response.body;
  }

  static generateThumbnailFromVideo(fileName: string, output: string) {
    command
      .input(`${pathToAssets}${fileName}`)
      .seekInput(134.5)
      .output(`${pathToAssets}${output}.png`)
      .on("end", () => {
        console.log("Finished processing");
      })
      .run();
  }
}
