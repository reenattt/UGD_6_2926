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

export async function POST(request: Request) {
  const session = await verifyAuth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Server-side validation
    if (
      !body.sender_name?.trim() ||
      !body.receiver_name?.trim() ||
      !body.phone?.trim() ||
      !body.origin_city?.trim() ||
      !body.destination_city?.trim() ||
      !body.item_type?.trim()
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Auto-generate AWB if not provided
    const awb = body.awb?.trim() || `AWB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

    const result = await sql`
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
        vehicle_id,
        customer_id,
        origin_lat,
        origin_lng,
        dest_lat,
        dest_lng
      )
      VALUES (
        ${awb},
        CURRENT_DATE,
        ${body.sender_name},
        ${body.receiver_name},
        ${body.phone},
        ${body.origin_city},
        ${body.destination_city},
        ${body.item_type},
        ${weight},
        ${price},
        ${body.shipping_type || "Biasa"},
        ${shipmentStatus},
        ${body.notes || ""},
        ${body.vehicle_id ? Number(body.vehicle_id) : null},
        ${body.customer_id ? Number(body.customer_id) : null},
        ${originApt.lat},
        ${originApt.lng},
        ${destApt.lat},
        ${destApt.lng}
      )
      RETURNING id
    `;

    const shipmentId = result[0].id;

    await sql`
      INSERT INTO tracking_logs (shipment_id, status)
      VALUES (${shipmentId}, ${shipmentStatus})
    `;

    await sql`
      INSERT INTO shipment_details (shipment_id, insurance, note)
      VALUES (${shipmentId}, ${body.insurance || 'No'}, ${body.notes || ''})
    `;

    return Response.json({
      success: true,
      message: "Shipment created successfully",
    });

  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        error: error.message || "Failed to create shipment",
      },
      {
        status: 500,
      }
    );
  }
}