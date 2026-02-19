import axios from "axios";
import { env } from "@/config/env";

// TODO: Replace with token from auth storage (localStorage/sessionStorage) when implementing login
const MOCK_TOKEN =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJkb3JvdGh5Lm1pdGNoZWxsMTFAc3R1ZGVudC5tYXBsZXdvb2QuZWR1IiwiZW1haWwiOiJkb3JvdGh5Lm1pdGNoZWxsMTFAc3R1ZGVudC5tYXBsZXdvb2QuZWR1IiwidXNlcklkIjoyMDMsImlhdCI6MTc3MTQ2NzI0MywiZXhwIjoxNzcyMzMxMjQzfQ._hBUvaS434CDC7SbrHgr3D6eyS0jliNWPoc_amRX8g13ymBO2tZZID404VW2BAlT";

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${MOCK_TOKEN}`;
  return config;
});