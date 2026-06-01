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

export async function DELETE(request: Request) {
  const session = await verifyAuth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json({ error: "Missing shipment ID" }, { status: 400 });
    }

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

  } catch (error: any) {
    console.log("DELETE ERROR:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to delete shipment",
      },
      {
        status: 500,
      }
    );
  }
}