import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uwmpihvplckcbefzacqm.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bXBpaHZwbGNrY2JlZnphY3FtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4MTMwNywiZXhwIjoyMDk3OTU3MzA3fQ.EfPXaMxMsoL_23ORI84tnd8fg_CtDKQwEYMFEgeo9zs";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: events, error: eErr } = await supabase.from('evenements').select('*').eq('publie', true);
  console.log("SERVICE EVENTS ERROR:", eErr);
  console.log("SERVICE EVENTS COUNT:", events?.length);

  const { data: opps, error: oErr } = await supabase.from('opportunites').select('*').eq('statut', 'publie');
  console.log("SERVICE OPPS ERROR:", oErr);
  console.log("SERVICE OPPS COUNT:", opps?.length);
}

testFetch();
