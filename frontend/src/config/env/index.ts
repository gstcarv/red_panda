import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {},

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `VITE_`.
   */
  clientPrefix: 'VITE_',
  client: {
    VITE_API_BASE_URL: z.url().optional().default('http://localhost:8080'),
    VITE_ENABLE_MSW: z
      .string()
      .optional()
      .default('false')
      .transform((val) => val === 'true'),
  },

  /**
   * You can't destruct `process.env` as a regular object in Vite client-side code,
   * so we need to destruct manually from `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
