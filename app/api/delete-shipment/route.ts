import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: "require",
});

export async function DELETE(request: Request) {

  try {

    const body = await request.json();

    console.log("DELETE SHIPMENT:", body.id);

    // ================= DELETE RELATION =================

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

    // ================= DELETE MAIN SHIPMENT =================

    await sql`

      DELETE FROM shipments

      WHERE id = ${body.id}

    `;

    return Response.json({

      success: true,

      message: "Shipment deleted successfully",

    });

  } catch (error) {

    console.log("DELETE ERROR:", error);

    return Response.json(

      {

        success: false,

        error: "Failed to delete shipment",

      },

      {

        status: 500,

      }

    );

  }

}