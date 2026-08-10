import { db } from '../src/db/index';
import { formations } from '../src/db/schema';
import { like, and, not, eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function clean() {
  console.log('🔄 Suppression des formations factices...');
  try {
    const result = await db.delete(formations)
      .where(
        and(
          like(formations.id, 'ext-%'),
          not(eq(formations.source_externe, 'FAO elearning Academy'))
        )
      );
    console.log(`✅ Suppression terminée.`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
  }
  process.exit(0);
}

clean();
