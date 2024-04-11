import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  name: 'DB',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'admin',
  database: process.env.DB_NAME || 'fake_bank',
  debug: process.env.DB_DEBUG === 'true',
};
