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
    ssl: config.get('database.ssl'),
    autoLoadEntities: true,

    synchronize: false, // NEVER enable in production
    migrationsRun: true,

    logging: config.get('NODE_ENV') !== 'production',
  };
};
