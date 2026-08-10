const { createClient } = require('@libsql/client');
const client = createClient({ url: 'file:local.db' });
async function run() {
  const res = await client.execute('SELECT titre, cover_image_url FROM formations;');
  console.log(res.rows);
}
run();
