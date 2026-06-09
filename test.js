const postgres = require('postgres');
const sql = postgres('postgres://default:oMEn3r4ZkYjJ@ep-autumn-flower-a1m5m9z8-pooler.ap-southeast-1.aws.neon.tech/verceldb?sslmode=require');
async function test() {
  const s1 = await sql`/* cache bypass */ SELECT id, created_at, updated_at FROM shipments LIMIT 1`;
  console.log('Before:', s1[0]);
  const u1 = await sql`/* cache bypass */ UPDATE shipments SET updated_at = CURRENT_TIMESTAMP WHERE id = ${s1[0].id} RETURNING updated_at`;
  console.log('After update 1:', u1[0]);
  await new Promise(r => setTimeout(r, 2000));
  const u2 = await sql`/* cache bypass */ UPDATE shipments SET updated_at = CURRENT_TIMESTAMP WHERE id = ${s1[0].id} RETURNING updated_at`;
  console.log('After update 2:', u2[0]);
  process.exit(0);
}
test();
