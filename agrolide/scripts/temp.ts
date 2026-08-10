import { db } from "../src/db/index";
import { formations } from "../src/db/schema";

async function main() {
  const allFormations = await db.query.formations.findMany();
  for (const f of allFormations) {
    if (f.titre.includes("Agrobusiness")) {
      console.log(f.id, f.titre, f.cover_image_url);
    }
  }
}
main();
