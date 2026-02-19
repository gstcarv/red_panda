/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MSW?: string;
  readonly SKIP_ENV_VALIDATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
