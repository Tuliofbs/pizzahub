import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { seedInitialData } from "@/db/seed";

export async function GET() {
  try {
    await seedInitialData();
    const list = await db.select().from(tenants).orderBy(tenants.name);
    return NextResponse.json({ success: true, tenants: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, phone, city, state, address, pixKeyType, pixKey, pixReceiverName, pixBankName, whatsappNumber, deliveryFee, minOrderAmount, openingHours } = body;

    if (!name || !slug || !phone) {
      return NextResponse.json({ success: false, error: "Nome, slug e telefone são obrigatórios" }, { status: 400 });
    }

    const id = `tenant-${slug.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newTenant = {
      id,
      name,
      slug: slug.toLowerCase().trim(),
      phone,
      city: city || "Limoeiro do Norte",
      state: state || "CE",
      address: address || "Centro",
      active: true,
      primaryColor: "#031B33",
      accentColor: "#F26522",
      logoUrl: "/logo-icon.svg",
      pixKeyType: pixKeyType || "CNPJ",
      pixKey: pixKey || "00.000.000/0001-00",
      pixReceiverName: pixReceiverName || name,
      pixBankName: pixBankName || "Banco Inter",
      whatsappNumber: (whatsappNumber || phone).replace(/\D/g, ""),
      deliveryFee: deliveryFee || "5.00",
      minOrderAmount: minOrderAmount || "20.00",
      openingHours: openingHours || "18:00 às 23:30",
    };

    await db.insert(tenants).values(newTenant);
    return NextResponse.json({ success: true, tenant: newTenant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
