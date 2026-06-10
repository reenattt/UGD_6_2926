import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Forbidden in production" }, { status: 403 });
  }
  try {
    await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
