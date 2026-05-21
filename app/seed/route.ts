import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

// ================= CUSTOMERS =================
async function seedCustomers() {

await sql`DROP TABLE IF EXISTS shipment_items CASCADE`;
await sql`DROP TABLE IF EXISTS tracking_logs CASCADE`;
await sql`DROP TABLE IF EXISTS shipment_details CASCADE`;
await sql`DROP TABLE IF EXISTS shipments CASCADE`;
await sql`DROP TABLE IF EXISTS items CASCADE`;
await sql`DROP TABLE IF EXISTS customers CASCADE`; 

  await sql`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name TEXT,
      city TEXT
    );
  `;

  await sql`
    INSERT INTO customers (name, city)
    VALUES
      ('Reynard', 'Jakarta'),
      ('Arnold', 'Bandung'),
      ('Flynn', 'Surabaya'),
      ('Kevin', 'Bali'),
      ('Rico', 'Medan'),
      ('Joko', 'Semarang'),
      ('Budi', 'Makassar'),
      ('Sinta', 'Jogja'),
      ('Lina', 'Batam'),
      ('Dewi', 'Pontianak');
  `;
}

// ================= ITEMS =================
async function seedItems() {

  await sql`
    CREATE TABLE items (
      id SERIAL PRIMARY KEY,
      item_name TEXT,
      weight INT
    );
  `;

  await sql`
    INSERT INTO items (item_name, weight)
    VALUES
      ('Laptop', 5),
      ('Phone', 1),
      ('Shoes', 2),
      ('Clothes', 3),
      ('Books', 4),
      ('Medicine', 1),
      ('Food', 6),
      ('Camera', 2),
      ('Watch', 1),
      ('Bag', 3);
  `;
}

// ================= SHIPMENTS =================
async function seedShipments() {

  await sql`
    CREATE TABLE shipments (
      id SERIAL PRIMARY KEY,
      awb TEXT,
      destination TEXT,
      customer_id INT REFERENCES customers(id)
    );
  `;

  await sql`
    INSERT INTO shipments (awb, destination, customer_id)
    VALUES
      ('AWB001', 'CGK', 1),
      ('AWB002', 'SIN', 1),
      ('AWB003', 'KUL', 2),
      ('AWB004', 'BKK', 3),
      ('AWB005', 'HKG', 4),
      ('AWB006', 'DPS', 5),
      ('AWB007', 'SUB', 6),
      ('AWB008', 'JOG', 7),
      ('AWB009', 'PKU', 8),
      ('AWB010', 'BDO', 9);
  `;
}

// shipments detail 
async function seedShipmentDetails() {
  await sql`
    CREATE TABLE IF NOT EXISTS shipment_details (
      id SERIAL PRIMARY KEY,
      shipment_id INT UNIQUE REFERENCES shipments(id),
      insurance TEXT,
      note TEXT
    );
  `;

  await sql`
    INSERT INTO shipment_details (shipment_id, insurance, note)
    VALUES
      (1, 'Yes', 'Fragile item'),
      (2, 'No', 'Handle with care'),
      (3, 'Yes', 'Electronic goods'),
      (4, 'No', 'Documents only'),
      (5, 'Yes', 'Express delivery'),
      (6, 'No', 'Standard shipment'),
      (7, 'Yes', 'Medical supplies'),
      (8, 'No', 'Food package'),
      (9, 'Yes', 'Luxury goods'),
      (10, 'No', 'Regular shipment');
  `;
}

// ================= TRACKING LOGS =================
async function seedTrackingLogs() {

  await sql`
    CREATE TABLE tracking_logs (
      id SERIAL PRIMARY KEY,
      shipment_id INT REFERENCES shipments(id),
      status TEXT
    );
  `;

  await sql`
    INSERT INTO tracking_logs (shipment_id, status)
    VALUES
      (1, 'Received'),
      (1, 'Departed'),
      (2, 'Sortation'),
      (3, 'Loaded'),
      (4, 'Arrived'),
      (5, 'Delayed'),
      (6, 'Received'),
      (7, 'Departed'),
      (8, 'Sortation'),
      (9, 'Loaded');
  `;
}

// ================= JUNCTION TABLE =================
async function seedShipmentItems() {

  await sql`
    CREATE TABLE shipment_items (
      shipment_id INT REFERENCES shipments(id),
      item_id INT REFERENCES items(id)
    );
  `;

  await sql`
    INSERT INTO shipment_items (shipment_id, item_id)
    VALUES
      (1,1),
      (1,2),
      (2,3),
      (3,4),
      (4,5),
      (5,6),
      (6,7),
      (7,8),
      (8,9),
      (9,10);
  `;
}

// ================= SEED Shipping Rates =================
async function seedShippingRates() {

  await sql`
    CREATE TABLE shipping_rates (
      id SERIAL PRIMARY KEY,
      destination TEXT,
      price INT
    );
  `;

  await sql`
    INSERT INTO shipping_rates (destination, price)
    VALUES
      ('CGK', 50000),
      ('SIN', 120000),
      ('KUL', 100000),
      ('BKK', 140000),
      ('HKG', 180000),
      ('DPS', 70000),
      ('SUB', 60000),
      ('JOG', 55000),
      ('PKU', 65000),
      ('BDO', 50000);
  `;
}

// ================= GET =================
export async function GET() {
  try {

    await seedCustomers();

    await seedItems();

    await seedShippingRates();

    await seedShipments();

    await seedShipmentDetails();

    await seedTrackingLogs();

    await seedShipmentItems();

    return Response.json({
      message: "Database seeded successfully",
    });

  } catch (error) {

    console.log(error);

    return Response.json({ error }, { status: 500 });

  }
}