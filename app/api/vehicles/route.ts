import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {
  try {
    const data = await sql`SELECT * FROM vehicles ORDER BY vehicle_name ASC`;
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
