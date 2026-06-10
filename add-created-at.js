const postgres = require('postgres');
const url = 'postgresql://neondb_owner:npg_gaefT02Dbmvw@ep-rapid-hat-a11sogza-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = postgres(url);

(async () => {
  try {
    await sql`ALTER TABLE tracking_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`;
    console.log("Success: added created_at to tracking_logs");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
})();
