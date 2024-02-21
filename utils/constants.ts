export const PORT = 3000;
export const API = "http://localhost:3000";

export const CLIENT_UPLOAD_ENDPOINT = `${API}/media/upload`;

export const API_UPLOAD_PATH = "./uploads";
export const API_UPLOAD_ENDPOINT = "/upload";

export const CORS = {
  origin: ["*", "http://localhost:5173"],
  allowHeaders: ["X-Custom-Header", "Content-Type"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
};
