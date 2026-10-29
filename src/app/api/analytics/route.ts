import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, tenants, users, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedInitialData();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    // Filtrar ou trazer estatísticas consolidadas
    const allOrders = tenantId 
      ? await db.select().from(orders).where(eq(orders.tenantId, tenantId))
      : await db.select().from(orders);

    const allTenants = await db.select().from(tenants);
    const allUsers = await db.select().from(users);
    const allProducts = await db.select().from(products);

    let totalRevenue = 0;
    let pendingPixCount = 0;
    let preparingCount = 0;
    let deliveredCount = 0;

    for (const ord of allOrders) {
      if (ord.paymentStatus === "CONFIRMED") {
        totalRevenue += parseFloat(ord.totalAmount);
      }
      if (ord.paymentStatus === "PENDING_VERIFICATION") {
        pendingPixCount++;
      }
      if (ord.status === "PREPARING" || ord.status === "RECEIVED") {
        preparingCount++;
      }
      if (ord.status === "DELIVERED") {
        deliveredCount++;
      }
    }

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: allOrders.length,
        pendingPixCount,
        preparingCount,
        deliveredCount,
        tenantsCount: allTenants.length,
        usersCount: allUsers.length,
        productsCount: allProducts.length,
      },
      tenants: allTenants,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
