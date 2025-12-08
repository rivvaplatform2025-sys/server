import { execSync } from 'child_process';
import * as path from 'path';

const name = process.env.npm_config_name;
if (!name) {
  console.error(
    '❌ Please provide migration name: npm run migration:generate --name=MigrationName',
  );
  process.exit(1);
}

// timestamp in YYYYMMDDHHmmss format
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
const migrationPath = path.join(
  'src',
  'database',
  'migrations',
  `${name}_${timestamp}`,
);

console.log(`📦 Generating migration: ${migrationPath}`);

// Execute TypeORM CLI to generate migration
try {
  execSync(
    `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate "${migrationPath}" -d typeorm.config.ts`,
    { stdio: 'inherit' },
  );
  console.log('✅ Migration generated successfully!');
} catch (err) {
  console.error('❌ Failed to generate migration:');
  console.error(err);
  process.exit(1);
}
