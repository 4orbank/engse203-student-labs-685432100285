import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');

/**
 * CP36 — รวม Environment Configuration ไว้ที่เดียว
 */
export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  get isProduction() {
    return this.nodeEnv === 'production';
  },

  get isProd() {
    return this.isProduction;
  },

  port: Number(process.env.PORT ?? 3001),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  dbFile: process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db'),
  schemaFile: path.join(API_ROOT, 'data', 'schema.sql'),

  staticDir: process.env.STATIC_DIR ??
    path.join(API_ROOT, '..', 'frontend', 'dist'),
};