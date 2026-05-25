import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function PUT(request: Request) {

  try {

    const body = await request.json();

    await sql`

      UPDATE shipments

      SET shipping_status = ${body.status}

      WHERE id = ${body.id}

    `;

    return Response.json({
      message: "Shipment updated successfully",
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      { error: "Failed to update shipment" },
      { status: 500 }
    );

  }

}