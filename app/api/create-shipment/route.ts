import postgres from "postgres";
import { cookies } from "next/headers";

const sql = postgres(process.env.DATABASE_URL!, {
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
      !body.awb?.trim() ||
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
        ${weight},
        ${price},
        ${body.shipping_type || "Biasa"},
        ${body.shipping_status || "Received"},
        ${body.notes || ""},
        ${body.vehicle_id ? Number(body.vehicle_id) : null}
      )
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