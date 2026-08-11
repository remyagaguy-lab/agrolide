import { db } from '../src/db/index';
import { formations } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function deleteCourse() {
  console.log('Suppression du cours ext-funmooc-3...');
  try {
    await db.delete(formations).where(eq(formations.id, 'ext-funmooc-3'));
    console.log('Cours supprimé avec succès !');
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
  process.exit(0);
}

deleteCourse();
