import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const data = await sql`
      SELECT *
      FROM shipments
      WHERE id = ${id}
      LIMIT 1
    `;

    if (data.length === 0) {
      return Response.json({ error: "Shipment not found" }, { status: 404 });
    }

    return Response.json(data[0]);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to fetch shipment" },
      { status: 500 }
    );
  }
}
