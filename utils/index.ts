export const formatBytes = (bytes: number) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = 2 < 0 ? 0 : 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.floor(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)))} ${sizes[i]}`;
};
