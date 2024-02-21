/**
 * @description
 * Convert bytes to human-readable string
 * @param bytes as number
 * @returns string with the size in human-readable format
 */
export const formatBytes = (bytes: number) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = 2 < 0 ? 0 : 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.floor(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)))} ${sizes[i]}`;
};

/**
 * @description
 * Get the file name from a path
 * @param path as string
 * @returns string with the file name
 */
export const getFileName = (path: string | undefined) =>
  path ? path.split(".").shift() : "";

/**
 * @description
 * Get the file type
 * @param path as string
 * @returns string with the file type i.e. image, video, audio, application
 */
export const getFileType = (path: string | undefined) => {
  if (!path) return "";
  return (
    path.includes(".") ? path.split(".").pop() : path.split("/")[0]
  ) as string;
};

/**
 * @description
 * Get the file format
 * @param path as string
 * @returns string with the file format i.e. mp4, jpg, pdf
 */
export const getFileFormat = (path: string | undefined) => {
  if (!path) return "";
  return (
    path.includes(".") ? path.split(".").pop() : path.split("/").pop()
  ) as string;
};
