import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';

async function main() {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    annuaire_visible: users.annuaire_visible
  }).from(users);
  
  console.log("Total users:", result.length);
  console.log("Users:", result);
}

main().catch(console.error);
