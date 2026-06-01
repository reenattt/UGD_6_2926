import { ITEM_CATEGORIES } from "../../lib/definitions";

export async function GET() {
  try {
    return Response.json(ITEM_CATEGORIES);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to fetch items" },
      { status: 500 }
    );
  }
}
