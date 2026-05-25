import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

export async function GET() {

  try {

    const data = await sql`

      SELECT *

      FROM shipments

      ORDER BY id DESC

    `;

    return Response.json(data);

  } catch (error) {

    console.log(error);

    return Response.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );

  }

}