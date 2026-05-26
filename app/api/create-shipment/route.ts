import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function POST(request: Request) {

  try {

    const body = await request.json();

    await sql`

      INSERT INTO shipments (

        awb,
        shipping_date,
        sender_name,
        receiver_name,
        phone,
        origin_city,
        destination_city,
        item_type,
        weight,
        price,
        shipping_type,
        shipping_status,
        notes,
        vehicle_id

      )

      VALUES (

        ${body.awb},
        CURRENT_DATE,
        ${body.sender_name},
        ${body.receiver_name},
        ${body.phone},
        ${body.origin_city},
        ${body.destination_city},
        ${body.item_type},
        ${body.weight},
        ${body.price},
        ${body.shipping_type},
        ${body.shipping_status},
        ${body.notes},
        ${body.vehicle_id}

      )

    `;

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        error: "Failed to create shipment",
      },
      {
        status: 500,
      }
    );

  }

}