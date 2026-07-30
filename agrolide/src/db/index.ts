import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// This setup is for local development with wrangler or remote Cloudflare D1 HTTP API
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./local.db', // Use HTTP URL or local file
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
