import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uwmpihvplckcbefzacqm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bXBpaHZwbGNrY2JlZnphY3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODEzMDcsImV4cCI6MjA5Nzk1NzMwN30.MrrtfRZ4nqGyLHroi5Esz_5t9yVdMYoLG1_FjoR2zXE";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: events, error: eErr } = await supabase.from('evenements').select('*').eq('publie', true);
  console.log("EVENTS ERROR:", eErr);
  console.log("EVENTS COUNT:", events?.length);
  if (events) {
    events.forEach(e => console.log(`Evt: ${e.titre}, created: ${e.created_at}`));
  }

  const { data: opps, error: oErr } = await supabase.from('opportunites').select('*').eq('statut', 'publie');
  console.log("OPPS ERROR:", oErr);
  console.log("OPPS COUNT:", opps?.length);
  if (opps) {
    opps.forEach(o => console.log(`Opp: ${o.titre}, created: ${o.created_at}`));
  }
}

testFetch();
