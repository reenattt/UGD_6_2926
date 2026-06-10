import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Forbidden in production" }, { status: 403 });
  }
  try {
    // Alter columns to use timestamp with time zone (TIMESTAMPTZ)
    await sql`ALTER TABLE shipments ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC'`;
    await sql`ALTER TABLE shipments ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'`;
    
    // Also update default values to ensure they use TIMESTAMPTZ
    await sql`ALTER TABLE shipments ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP`;
    await sql`ALTER TABLE shipments ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP`;

    return Response.json({ success: true, message: "Migrated to TIMESTAMPTZ successfully" });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
