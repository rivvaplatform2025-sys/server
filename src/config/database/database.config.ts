import { registerAs } from '@nestjs/config';
import { envSchema } from './env.validation';

export default registerAs('database', () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      '\n❌ Invalid environment variables for database configuration:',
    );
    console.error(parsed.error.format());
    process.exit(1);
  }

  const env = parsed.data;
  console.log(`Database Configurations, ${env.DATABASE_URL}`);

  const ssl =
    env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: false, // required for Supabase pools
        }
      : false;

  return {
    url: env.DATABASE_URL,
    ssl,
  };
});
