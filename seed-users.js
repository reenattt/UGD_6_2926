const postgres = require('postgres');
const bcrypt = require('bcrypt');

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function seed() {
  try {
    console.log("Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        enabled BOOLEAN DEFAULT true
      );
    `;
    console.log("Created users table.");

    console.log("Hashing passwords...");
    const hashedAdminPassword = await bcrypt.hash('hajarsiweb', 10);
    
    console.log("Inserting admin user...");
    await sql`
      INSERT INTO users (username, password, name, email, role, enabled)
      VALUES ('241712926', ${hashedAdminPassword}, 'Operator Admin', 'admin@petir.com', 'Admin', true)
      ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;
    `;
    console.log("Seeded admin user.");

    const ownerPassword = process.env.NEXT_PUBLIC_OWNER_PASSWORD || 'owner';
    const hashedOwnerPassword = await bcrypt.hash(ownerPassword, 10);
    await sql`
      INSERT INTO users (username, password, name, email, role, enabled)
      VALUES ('owner', ${hashedOwnerPassword}, 'Owner', 'owner@skylink.com', 'Owner', true)
      ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;
    `;
    console.log("Seeded owner user.");

  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    process.exit(0);
  }
}

seed();
