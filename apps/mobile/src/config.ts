const LOCAL_API_BASE_URL = "http://127.0.0.1:8000";
const PRODUCTION_API_BASE_URL = "https://makeup-personal-api.vercel.app";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development" ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL);
