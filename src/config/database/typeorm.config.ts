import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvSchema } from './env.validation';

export const createTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  const env = config.get<EnvSchema>('database');
  if (!env) {
    throw new Error(
      '❌ Missing database configuration — Zod validation should have prevented this',
    );
  }

  return {
    type: 'postgres',
    url: config.get<string>('database.url'),

    extra: {
      max: 1,
      ssl: config.get('database.ssl') ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
    },
    ssl: config.get('database.ssl'),
    autoLoadEntities: true,

    synchronize: false, // NEVER enable in production
    migrationsRun: true,

    logging: config.get('NODE_ENV') !== 'production',
  };
};
