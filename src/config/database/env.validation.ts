import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  DATABASE_URL: z.string().url({
    message:
      'DATABASE_URL must be a valid PostgreSQL connection string — e.g. postgresql://user:pass@host:5432/db',
  }),

  DB_SSL: z.enum(['true', 'false']).default('false'),
});

export type EnvSchema = z.infer<typeof envSchema>;
