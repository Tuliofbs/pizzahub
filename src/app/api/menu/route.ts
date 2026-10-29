import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productAddons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedInitialData();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") || "tenant-limoeiro-01";

    const cats = await db.select().from(categories).where(and(eq(categories.tenantId, tenantId), eq(categories.active, true))).orderBy(categories.sortOrder);
    const prods = await db.select().from(products).where(and(eq(products.tenantId, tenantId), eq(products.available, true))).orderBy(products.sortOrder);
    const addons = await db.select().from(productAddons).where(and(eq(productAddons.tenantId, tenantId), eq(productAddons.available, true)));

    return NextResponse.json({
      success: true,
      categories: cats,
      products: prods,
      addons: addons,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
