import type { Context, Env } from "hono";
// @ts-ignore
import type { BodyData } from "hono/dist/types/utils/body";
import type { BlankInput } from "hono/types";
import { API_UPLOAD_ENDPOINT } from "../../utils/constants.ts";

export type VideoTypes = "mp4" | "webm" | "ogg" | "mkv" | "avi" | "mov";

export type WriteFilesTypes = {
  files: BodyData;
  c: Context<Env, typeof API_UPLOAD_ENDPOINT, BlankInput>;
};

export type CustomFileType = {
  name: string;
  data: File | (string | (string | File)[]);
  type: string;
  fileName?: string;
};
