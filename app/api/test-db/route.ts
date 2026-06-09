import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const data = await sql`-- cache bypass
SELECT id, created_at, updated_at FROM shipments ORDER BY id DESC LIMIT 5`;
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
