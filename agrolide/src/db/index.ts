import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';
import { noterMesureD1 } from './mesure-d1';

/** Délai maximum d'un appel à D1 (millisecondes), réglable par D1_TIMEOUT_MS. */
const DELAI_D1_MS = Number(process.env.D1_TIMEOUT_MS) > 0 ? Number(process.env.D1_TIMEOUT_MS) : 15000;

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
  
  const debut = performance.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    // Délai maximum : si l'API Cloudflare ne répond plus, la page échoue proprement (page d'erreur)
    // au lieu de rester figée jusqu'à la limite de durée de Vercel. Un appel normal prend 60 à 125 ms.
    signal: AbortSignal.timeout(DELAI_D1_MS),
  });

  const json = await response.json();

  // Chronomètre discret (voir mesure-d1.ts) : durée de l'aller-retour complet vu depuis le serveur.
  noterMesureD1({
    sql,
    methode: method,
    totalMs: performance.now() - debut,
    sqlMs: typeof json?.result?.[0]?.meta?.duration === 'number' ? json.result[0].meta.duration : null,
    lignes: Array.isArray(json?.result?.[0]?.results) ? json.result[0].results.length : null,
  });

  if (!json.success) {
    console.error('D1 Error:', json.errors);
    throw new Error(json.errors?.[0]?.message || 'D1 API Error');
  }

  const result = json.result[0];

  if (method === 'run') {
    return { rows: [] };
  }

  // Fonction pour extraire les colonnes sélectionnées du SQL afin d'éviter le décalage des valeurs nulles
  function getSelectedColumns(sqlQuery: string) {
    const lowerSql = sqlQuery.toLowerCase();
    const selectIdx = lowerSql.indexOf('select ');
    if (selectIdx === -1) return [];
    
    let parenDepth = 0;
    let fromIdx = -1;
    for (let i = selectIdx + 7; i < lowerSql.length; i++) {
      if (lowerSql[i] === '(') parenDepth++;
      else if (lowerSql[i] === ')') parenDepth--;
      else if (parenDepth === 0 && lowerSql.substring(i, i + 4) === 'from') {
         const prev = lowerSql[i-1];
         const next = lowerSql[i+4];
         const isWhitespace = (c: string) => /\s/.test(c);
         if ((!prev || isWhitespace(prev)) && (!next || isWhitespace(next))) {
            fromIdx = i;
            break;
         }
      }
    }
    
    if (fromIdx === -1) return [];
    
    const columnsStr = sqlQuery.substring(selectIdx + 7, fromIdx);
    
    const columnsList: string[] = [];
    let current = "";
    parenDepth = 0;
    for (let i = 0; i < columnsStr.length; i++) {
      const char = columnsStr[i];
      if (char === '(') parenDepth++;
      if (char === ')') parenDepth--;
      if (char === ',' && parenDepth === 0) {
        columnsList.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      columnsList.push(current.trim());
    }

    return columnsList.map(col => {
      const aliasMatch = col.match(/(?:\s+as\s+)(?:"([^"]+)"|'([^']+)'|([^\s'"]+))\s*$/i);
      if (aliasMatch) {
        return aliasMatch[1] || aliasMatch[2] || aliasMatch[3];
      }
      const parts = col.split('.');
      const lastPart = parts[parts.length - 1].trim();
      return lastPart.replace(/^["'`\[]|["'`\]]$/g, '');
    });
  }

  const colNames = getSelectedColumns(sql);
  let rows: any[][] = [];

  if (colNames.length > 0 && result.results) {
    rows = result.results.map((row: any) => {
      return colNames.map(colName => (row[colName] !== undefined ? row[colName] : null));
    });
  } else if (result.results) {
    rows = result.results.map((row: any) => Object.values(row));
  }

  if (method === 'get') {
    return { rows: rows[0] || [] };
  }

  return { rows };
}, { schema });
