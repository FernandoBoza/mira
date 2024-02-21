import ffmpeg from "fluent-ffmpeg";
import { type BunFile } from "bun";
import type { VideoTypes } from "../types.ts";
import { formatBytes, getFileName } from "../../../utils";

const command = ffmpeg();
const pathToAssets = "./assets/";

export const deconstructFile = ({ name, size, type }: BunFile) => ({
  name: getFileName(name),
  size: formatBytes(size),
  type,
});

export const convertVideo = (
  fileName: string,
  output: string,
  type: VideoTypes = "mp4",
) => {
  command
    .input(`${pathToAssets}${fileName}`)
    .output(`${pathToAssets}${output}.${type}`)
    .on("end", () => {
      console.log("Finished processing");
    })
    .run();
};

export const uploadFileInChunks = async (file: BunFile): Promise<void> => {
  const chunkSize = 1048576; // 1MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunkIndex", `${i}`);

    // Replace with your API endpoint
    await fetch("/upload-chunk", {
      method: "POST",
      body: formData,
    });
  }
};

export const streamVideoFromCloud = async (url: string) => {
  const response = await fetch(url);
  return response.body;
};

export const generateThumbnailFromVideo = (
  fileName: string,
  output: string,
) => {
  command
    .input(`${pathToAssets}${fileName}`)
    .seekInput(134.5)
    .output(`${pathToAssets}${output}.png`)
    .on("end", () => {
      console.log("Finished processing");
    })
    .run();
};

// convertVideo('2020NYE.mp4', '2020NYE', 'avi')
