"use server";

import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { SessionUser } from './auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function verifyUserAction(username: string, password?: string): Promise<SessionUser | null> {
  if (!username || !password) return null;

  try {
    const users = await sql`
      SELECT * FROM users
      WHERE username = ${username} AND enabled = true
    `;

    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      return {
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role as "Admin" | "Owner"
      };
    }

    return null;
  } catch (error) {
    console.error("Database error during authentication:", error);
    return null;
  }
}
