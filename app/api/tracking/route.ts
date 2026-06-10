import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function GET(request: Request) {

  try {

    const { searchParams } =
      new URL(request.url);

    const awb =
      searchParams.get("awb");

    const shipment = await sql`
      -- cache bypass
      SELECT *
      FROM shipments
      WHERE awb = ${awb}
    `;

    if (shipment.length === 0) {
      return Response.json({
        found: false,
      });
    }

    const trackingLogs = await sql`
      SELECT *
      FROM tracking_logs
      WHERE shipment_id = ${shipment[0].id}
      ORDER BY created_at ASC
    `;

    return Response.json({
      found: true,
      shipment: {
        awb: shipment[0].awb,
        origin_city: shipment[0].origin_city,
        destination_city: shipment[0].destination_city,
        item_type: shipment[0].item_type,
        weight: shipment[0].weight,
        shipping_status: shipment[0].shipping_status,
        shipping_type: shipment[0].shipping_type
      },
      logs: trackingLogs,
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Failed to fetch tracking",
      },
      {
        status: 500,
      }
    );

  }

}