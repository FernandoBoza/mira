import type { Context, Env } from "hono";
import type { BlankInput } from "hono/types";

export type VideoTypes = "mp4" | "webm" | "ogg" | "mkv" | "avi" | "mov";

export type CustomFileType = {
  name: string;
  data: File | (string | (string | File)[]);
  type: string;
  fileName?: string;
};

export type FileError = {
  fileName: string;
  errorMessage: string;
  errorDetails: unknown;
};

export type CustomContext<P extends string> = Context<Env, P, BlankInput>;
