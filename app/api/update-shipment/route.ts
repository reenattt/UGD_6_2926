import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function PUT(request: Request) {

  try {

    const body = await request.json();

    await sql`

      UPDATE shipments

      SET

        sender_name = ${body.sender_name},

        receiver_name = ${body.receiver_name},

        phone = ${body.phone},

        origin_city = ${body.origin_city},

        destination_city = ${body.destination_city},

        item_type = ${body.item_type},

        weight = ${body.weight},

        price = ${body.price},

        shipping_type = ${body.shipping_type},

        shipping_status = ${body.shipping_status},

        notes = ${body.notes},

        vehicle_id = ${body.vehicle_id}

      WHERE id = ${body.id}

    `;

    return Response.json({
      success: true,
      message: "Shipment updated successfully",
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Failed to update shipment",
      },
      {
        status: 500,
      }
    );

  }

}