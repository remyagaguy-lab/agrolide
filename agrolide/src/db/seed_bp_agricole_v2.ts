import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from './index.js';
import { formations, formation_modules, formation_lecons } from './schema.js';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';

import { parcours1 } from './content/bp_agricole/parcours_1.js';
import { parcours2 } from './content/bp_agricole/parcours_2.js';
import { parcours3 } from './content/bp_agricole/parcours_3.js';
import { parcours4 } from './content/bp_agricole/parcours_4.js';
import { parcours5 } from './content/bp_agricole/parcours_5.js';
import { parcours6 } from './content/bp_agricole/parcours_6.js';

const allParcours = [
  parcours1,
  parcours2,
  parcours3,
  parcours4,
  parcours5,
  parcours6
];

async function seedBusinessPlanV2() {
  console.log('Seeding ultra-detailed Business Plan Agricole course (V2 modular)...');

  const formationId = 'form_bp_agricole';

  // Check if exists
  const existing = await db.query.formations.findFirst({
    where: eq(formations.id, formationId),
  });

  if (existing) {
    console.log('Formation exists, deleting old data to replace with V2 modular version...');
    
    // Find all modules to delete their lessons first
    const existingModules = await db.query.formation_modules.findMany({
      where: eq(formation_modules.formation_id, formationId),
    });
    
    for (const mod of existingModules) {
      await db.delete(formation_lecons).where(eq(formation_lecons.module_id, mod.id));
    }
    
    await db.delete(formation_modules).where(eq(formation_modules.formation_id, formationId));
    await db.delete(formations).where(eq(formations.id, formationId));
  }

  // 1. Insert Formation
  await db.insert(formations).values({
    id: formationId,
    titre: "Rédiger un business plan agricole qui convainc",
    description: "De l'idée au dossier de financement — 23 modules pour construire, chiffrer et défendre votre projet agricole. Une méthode pas à pas basée sur le cas réel de l'exploitation de Diap Touré (Niayes, Sénégal).",
    thematique: "Agrobusiness",
    niveau: "Débutant à Intermédiaire",
    modalite: "En ligne",
    prix_fcfa: 0,
    cover_image_url: "/images/formations/cover_bp_agricole.png",
    statut: "publie",
    acces: "public",
  });
  console.log('Formation inserted.');

  let currentOrdreModule = 1;

  for (const parcours of allParcours) {
    console.log(`Inserting Parcours: ${parcours.titre}`);
    
    // Each 'Parcours' maps to a 'Module' in our DB schema
    const moduleId = parcours.id;
    
    await db.insert(formation_modules).values({
      id: moduleId,
      formation_id: formationId,
      titre: parcours.titre,
      description: parcours.description,
      ordre: currentOrdreModule,
    });
    
    let currentOrdreLecon = 1;
    for (const lecon of parcours.lecons) {
      await db.insert(formation_lecons).values({
        id: lecon.id,
        module_id: moduleId,
        titre: lecon.titre,
        contenu: lecon.contenu,
        duree_minutes: lecon.duree_minutes || 10,
        ordre: currentOrdreLecon,
        quiz_json: lecon.quiz_json || [],
      });
      currentOrdreLecon++;
    }
    
    currentOrdreModule++;
  }

  console.log('Successfully seeded Business Plan Agricole (V2).');
  process.exit(0);
}

seedBusinessPlanV2().catch((err) => {
  console.error("Error seeding DB:", err);
  process.exit(1);
});
