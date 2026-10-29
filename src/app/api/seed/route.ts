import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants, users, categories, products, orders, orderItems } from "@/db/schema";
import { seedInitialData } from "@/db/seed";

export async function GET() {
  try {
    await seedInitialData();

    const tList = await db.select().from(tenants);
    const uList = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      tenantId: users.tenantId,
      phone: users.phone,
    }).from(users);
    const pList = await db.select().from(products);
    const oList = await db.select().from(orders);

    return NextResponse.json({
      success: true,
      data: {
        tenantsCount: tList.length,
        usersCount: uList.length,
        productsCount: pList.length,
        ordersCount: oList.length,
        tenants: tList,
        users: uList,
      },
    });
  } catch (error: any) {
    console.error("Seed API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
