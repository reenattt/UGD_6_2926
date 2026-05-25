import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function POST(request: Request) {

  console.log("DELETE API CALLED");

  try {

    const body = await request.json();

    // HAPUS RELASI DULU

    await sql`

      DELETE FROM tracking_logs

      WHERE shipment_id = ${body.id}

    `;

    await sql`

      DELETE FROM shipment_details

      WHERE shipment_id = ${body.id}

    `;

    await sql`

      DELETE FROM shipment_items

      WHERE shipment_id = ${body.id}

    `;

    // BARU HAPUS SHIPMENT

    await sql`

      DELETE FROM shipments

      WHERE id = ${body.id}

    `;

    return Response.json({
      message: "Shipment deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      { error: "Failed to delete shipment" },
      { status: 500 }
    );

  }

}