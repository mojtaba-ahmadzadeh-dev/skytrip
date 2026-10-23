import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = process.cwd();

dotenv.config({
  path: join(rootDir, `.env.${process.env.NODE_ENV ?? 'development'}`),
});

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_DATABASE) {
  throw new Error(
    'Missing required database environment variables. Check your .env file.',
  );
}

const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,

  entities: [join(rootDir, 'src', '**', '*.entity{.ts,.js}')],

  migrations: [join(rootDir, 'src', 'migrations', '*{.ts,.js}')],

  migrationsTableName: 'skytrip_migrations',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});

export default dataSource;
