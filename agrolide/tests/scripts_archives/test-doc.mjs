import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
async function run() {
  const { data, error } = await supabase.from('documents').select('*').eq('id', '49192cf8-6241-4e56-b93f-61830c786844').single()
  if (error) console.error("Error:", error)
  console.log("Document:", data)
}
run()
