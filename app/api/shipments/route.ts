import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await sql`
      -- cache bypass
      SELECT *
      FROM shipments
      ORDER BY id DESC
    `;
    return Response.json(data);
  } catch (error: any) {
    console.log(error);
    return Response.json(
      { error: "Failed to fetch shipments: " + error.message },
      { status: 500 }
    );
  }
}