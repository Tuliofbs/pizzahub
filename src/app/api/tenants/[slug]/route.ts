import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await seedInitialData();
    const { slug } = await params;

    const found = await db.select().from(tenants).where(eq(tenants.slug, slug.toLowerCase().trim()));
    if (found.length === 0) {
      return NextResponse.json({ success: false, error: "Pizzaria / Unidade não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, tenant: found[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
