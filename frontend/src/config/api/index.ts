import axios from "axios";

// In development with MSW, use same origin so the service worker can intercept.
const baseURL =
  import.meta.env.DEV ? "" : "http://localhost:3000";

export const api = axios.create({
  baseURL,
});