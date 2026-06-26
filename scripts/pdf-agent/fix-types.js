require('dotenv').config({ override: true });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixTypes() {
  console.log("Recherche des documents...");
  const { data: documents, error } = await supabase.from('documents').select('id, titre').eq('type_doc', 'article');
  
  if (error) {
    console.error("Erreur:", error);
    return;
  }
  
  console.log(`${documents.length} documents à vérifier.`);
  
  for (const doc of documents) {
    const t = doc.titre.toLowerCase();
    let typeDoc = 'article';
    
    if (t.includes('thès') || t.includes('these')) typeDoc = 'these';
    else if (t.includes('mémoire') || t.includes('memoire')) typeDoc = 'memoire';
    else if (t.includes('fiche')) typeDoc = 'fiche_technique';
    else if (t.includes('guide')) typeDoc = 'guide_pratique';
    else if (t.includes('rapport')) typeDoc = 'rapport';
    
    if (typeDoc !== 'article') {
      console.log(`Correction: "${doc.titre}" -> ${typeDoc}`);
      await supabase.from('documents').update({ type_doc: typeDoc }).eq('id', doc.id);
    }
  }
  
  console.log("Terminé !");
}

fixTypes();
