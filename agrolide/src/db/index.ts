import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';

export const db = drizzle(async (sql, params, method) => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const dbId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  // En développement local (si pas de token Cloudflare), on pourrait utiliser un mock ou laisser l'erreur
  if (!accountId || !dbId || !token) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Variables Cloudflare D1 manquantes. Requête annulée.');
      return { rows: [] };
    }
    throw new Error('Cloudflare D1 credentials missing in environment variables');
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const json = await response.json();
  
  if (!json.success) {
    console.error('D1 Error:', json.errors);
    throw new Error(json.errors?.[0]?.message || 'D1 API Error');
  }

  const result = json.result[0];

  if (method === 'run') {
    return { rows: [] };
  }

  // Drizzle sqlite-proxy attend un tableau de tableaux de valeurs
  const rows = result.results.map((row: any) => Object.values(row));
  return { rows };
}, { schema });
