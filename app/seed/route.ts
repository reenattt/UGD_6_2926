import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

// ================= CUSTOMERS =================
async function seedCustomers() {

  await sql`DROP TABLE IF EXISTS shipment_items CASCADE`;
  await sql`DROP TABLE IF EXISTS tracking_logs CASCADE`;
  await sql`DROP TABLE IF EXISTS shipment_details CASCADE`;
  await sql`DROP TABLE IF EXISTS shipping_rates CASCADE`;
  await sql`DROP TABLE IF EXISTS shipments CASCADE`;
  await sql`DROP TABLE IF EXISTS vehicles CASCADE`;
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

// ================= VEHICLES =================
async function seedVehicles() {

  await sql`
    CREATE TABLE vehicles (
      id SERIAL PRIMARY KEY,

      vehicle_name TEXT,

      vehicle_type TEXT,

      plate_number TEXT,

      capacity INT,

      vehicle_status TEXT
    );
  `;

  await sql`
    INSERT INTO vehicles (
      vehicle_name,
      vehicle_type,
      plate_number,
      capacity,
      vehicle_status
    )

    VALUES

    (
      'Truck Jakarta',
      'Truck',
      'B 1234 CD',
      1000,
      'Available'
    ),

    (
      'Cargo Van',
      'Van',
      'D 5678 EF',
      500,
      'On Delivery'
    ),

    (
      'Sky Aircraft',
      'Aircraft',
      'PK-AAA',
      5000,
      'Ready'
    );
  `;
}

// ================= SHIPPING RATES =================
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

// ================= SHIPMENTS =================
async function seedShipments() {

  await sql`
    CREATE TABLE shipments (
      id SERIAL PRIMARY KEY,

      awb TEXT,

      shipping_date DATE,

      sender_name TEXT,

      receiver_name TEXT,

      phone TEXT,

      origin_city TEXT,

      destination_city TEXT,

      item_type TEXT,

      weight INT,

      price INT,

      shipping_type TEXT,

      shipping_status TEXT,

      notes TEXT,

      vehicle_id INT REFERENCES vehicles(id),

      customer_id INT REFERENCES customers(id),

      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

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

      vehicle_id,

      customer_id
    )

    VALUES

    (
      'AWB001',
      '2026-05-25',
      'Reynard',
      'Budi',
      '08123456789',
      'Jakarta',
      'CGK',
      'Laptop',
      5,
      50000,
      'Express',
      'Diproses',
      'Fragile item',
      1,
      1
    ),

    (
      'AWB002',
      '2026-05-25',
      'Arnold',
      'Kevin',
      '08111111111',
      'Bandung',
      'SIN',
      'Phone',
      2,
      120000,
      'Biasa',
      'Dalam Pengiriman',
      'Handle with care',
      2,
      1
    ),

    (
      'AWB003',
      '2026-05-25',
      'Flynn',
      'Sinta',
      '08222222222',
      'Surabaya',
      'KUL',
      'Shoes',
      3,
      100000,
      'VVIP',
      'Selesai',
      'Fast delivery',
      3,
      2
    ),

    (
      'AWB004',
      '2026-05-25',
      'Kevin',
      'Rico',
      '08333333333',
      'Bali',
      'BKK',
      'Clothes',
      4,
      140000,
      'Express',
      'Pending',
      'Fashion package',
      1,
      3
    ),

    (
      'AWB005',
      '2026-05-25',
      'Rico',
      'Lina',
      '08444444444',
      'Medan',
      'HKG',
      'Books',
      6,
      180000,
      'VVIP',
      'Sampai Tujuan',
      'Education shipment',
      2,
      4
    );
  `;
}

// ================= SHIPMENT DETAILS =================
async function seedShipmentDetails() {

  await sql`
    CREATE TABLE shipment_details (
      id SERIAL PRIMARY KEY,

      shipment_id INT UNIQUE REFERENCES shipments(id),

      insurance TEXT,

      note TEXT
    );
  `;

  await sql`
    INSERT INTO shipment_details (
      shipment_id,
      insurance,
      note
    )

    VALUES

    (1, 'Yes', 'Fragile item'),

    (2, 'No', 'Handle with care'),

    (3, 'Yes', 'Electronic goods'),

    (4, 'No', 'Documents only'),

    (5, 'Yes', 'Express delivery');
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
    INSERT INTO tracking_logs (
      shipment_id,
      status
    )

    VALUES

    (1, 'Received'),

    (1, 'Departed'),

    (2, 'Sortation'),

    (3, 'Loaded'),

    (4, 'Arrived'),

    (5, 'Delayed');
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
    INSERT INTO shipment_items (
      shipment_id,
      item_id
    )

    VALUES

    (1,1),

    (1,2),

    (2,3),

    (3,4),

    (4,5),

    (5,6);
  `;
}

// ================= GET =================
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Forbidden in production" }, { status: 403 });
  }

  try {

    await seedCustomers();

    await seedItems();

    await seedVehicles();

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