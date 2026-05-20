// ini kode biar bisa conect ke neon 
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

// ini adalah tabel customer 
// SERIAL PRIMARY KEY itu biar kode otomatios dan unik 
async function seedCustomers() {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
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

// ini shipments 
// customer_id INT REFERENCES customers(id) 
// ini artinya shipments terhubung ke cus`tomers dengan customer_id sebagai foreign key yang merujuk ke id di tabel customers              
async function seedShipments() {
  await sql`
    CREATE TABLE IF NOT EXISTS shipments (
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


// tracking logs
// shipments → tracking_logs
// 1 shipment punya banyak tracking.
async function seedTrackingLogs() {
  await sql`
    CREATE TABLE IF NOT EXISTS tracking_logs (
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

// items
async function seedItems() {
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      item_name TEXT
    );
  `;

  await sql`
    INSERT INTO items (item_name)
    VALUES
      ('Laptop'),
      ('Phone'),
      ('Shoes'),
      ('Clothes'),
      ('Books'),
      ('Medicine'),
      ('Food'),
      ('Camera'),
      ('Watch'),
      ('Bag');
  `;
}

// junction table 
//shipment_items adalah junction table 
async function seedShipmentItems() {
  await sql`
    CREATE TABLE IF NOT EXISTS shipment_items (
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

export async function GET() {
  try {

    // urutan penting
    await seedCustomers();

    await seedItems();

    await seedShipments();

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