import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

// SHIPMENTS
async function seedShipments() {
  await sql`
    CREATE TABLE IF NOT EXISTS shipments (
      id SERIAL PRIMARY KEY,
      awb TEXT UNIQUE,
      origin TEXT,
      destination TEXT,
      commodity TEXT,
      weight TEXT
    );
  `;

  await sql`
    INSERT INTO shipments (awb, origin, destination, commodity, weight)
    VALUES
      ('AWB-001', 'SUB', 'CGK', 'General Cargo', '120kg'),
      ('AWB-002', 'CGK', 'SIN', 'Documents', '45kg'),
      ('AWB-003', 'KUL', 'BKK', 'Electronics', '200kg')
    ON CONFLICT (awb) DO NOTHING;
  `;
}

// TRACKING LOGS (RELASI)
async function seedTrackingLogs() {
  await sql`
    CREATE TABLE IF NOT EXISTS tracking_logs (
      id SERIAL PRIMARY KEY,
      shipment_id INT REFERENCES shipments(id),
      status TEXT,
      time TEXT
    );
  `;

  await sql`
    INSERT INTO tracking_logs (shipment_id, status, time)
    VALUES
      (1, 'Received', '08:00'),
      (1, 'Sortation', '10:00'),
      (1, 'Departed', '12:00'),

      (2, 'Received', '09:00'),
      (2, 'Loaded', '11:00'),

      (3, 'Received', '07:30'),
      (3, 'Sortation', '09:30')
    ON CONFLICT DO NOTHING;
  `;
}

// ROUTE
export async function GET() {
  try {
    await sql.begin(async () => {
      await seedShipments();
      await seedTrackingLogs();
    });

    return Response.json({
      message: "Database seeded successfully (tracking relation)",
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}