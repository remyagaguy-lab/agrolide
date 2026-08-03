import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDoc() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', '7e92701c-017e-45cc-9649-1730fcbe4499');
    
  console.log("Document:", data, "Error:", error);
}

checkDoc();
