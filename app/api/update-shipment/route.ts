import postgres from "postgres";
import { cookies } from "next/headers";
import { resolveAirport } from "../../lib/airports";

const sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "require",
});

async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");
    if (!sessionCookie) return null;
    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    const allowedRoles = ["Admin", "Owner"];
    if (!allowedRoles.includes(session.role)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function PUT(request: Request) {
  const session = await verifyAuth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (
      !body.id ||
      !body.sender_name?.trim() ||
      !body.receiver_name?.trim() ||
      !body.phone?.trim() ||
      !body.origin_city?.trim() ||
      !body.destination_city?.trim() ||
      !body.item_type?.trim()
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const weight = Number(body.weight);
    if (isNaN(weight) || weight <= 0) {
      return Response.json({ error: "Weight must be a positive number" }, { status: 400 });
    }

    const price = Number(body.price);
    if (isNaN(price) || price <= 0) {
      return Response.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    const shipmentStatus = body.shipping_status || "Received";
    const originApt = resolveAirport(body.origin_city);
    const destApt = resolveAirport(body.destination_city);

    await sql`
      UPDATE shipments
      SET
        sender_name = ${body.sender_name},
        receiver_name = ${body.receiver_name},
        phone = ${body.phone},
        origin_city = ${body.origin_city},
        destination_city = ${body.destination_city},
        item_type = ${body.item_type},
        weight = ${weight},
        price = ${price},
        shipping_type = ${body.shipping_type || "Biasa"},
        shipping_status = ${shipmentStatus},
        notes = ${body.notes || ""},
        vehicle_id = ${body.vehicle_id ? Number(body.vehicle_id) : null},
        customer_id = ${body.customer_id ? Number(body.customer_id) : null},
        origin_lat = ${originApt.lat},
        origin_lng = ${originApt.lng},
        dest_lat = ${destApt.lat},
        dest_lng = ${destApt.lng}
      WHERE id = ${body.id}
    `;

    // Only insert a new tracking log if the status changed.
    // For simplicity, we just insert the new status log for the audit.
    await sql`
      INSERT INTO tracking_logs (shipment_id, status)
      VALUES (${body.id}, ${shipmentStatus})
    `;

    return Response.json({
      success: true,
      message: "Shipment updated successfully",
    });

  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        error: error.message || "Failed to update shipment",
      },
      {
        status: 500,
      }
    );
  }
}