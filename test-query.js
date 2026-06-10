const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || 'postgres://localhost', { ssl: 'require' });

(async () => {
  try {
    const res = await sql`SELECT * FROM tracking_logs LIMIT 5`;
    console.log("Success:", res);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
})();
