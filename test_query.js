const postgres = require('postgres');
const url = 'postgresql://neondb_owner:npg_gaefT02Dbmvw@ep-rapid-hat-a11sogza-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = postgres(url);

(async () => {
  try {
    const shipments = await sql`SELECT * FROM shipments LIMIT 1`;
    console.log(shipments);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
})();
