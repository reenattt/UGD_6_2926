import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function listTracking() {
  const data = await sql`
    SELECT 
      shipments.awb,
      tracking_logs.status,
      tracking_logs.time
    FROM tracking_logs
    JOIN shipments ON tracking_logs.shipment_id = shipments.id
    ORDER BY shipments.awb, tracking_logs.id
  `;

  return data;
}

export async function GET() {
  try {
    return Response.json(await listTracking());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}