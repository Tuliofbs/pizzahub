import { NextResponse } from "next/server";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function PATCH(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const {
      id,
      name,
      slug,
      phone,
      city,
      state,
      address,
      primaryColor,
      accentColor,
      openingHours,
      deliveryFee,
      minOrderAmount,
      pixKeyType,
      pixKey,
      pixReceiverName,
      pixBankName,
      whatsappNumber,
      bannerUrl,
      logoUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID da empresa obrigatório." }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (slug) updateData.slug = slug.toLowerCase().trim();
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (address) updateData.address = address;
    if (primaryColor) updateData.primaryColor = primaryColor;
    if (accentColor) updateData.accentColor = accentColor;
    if (openingHours) updateData.openingHours = openingHours;
    if (deliveryFee) updateData.deliveryFee = deliveryFee;
    if (minOrderAmount) updateData.minOrderAmount = minOrderAmount;
    if (pixKeyType) updateData.pixKeyType = pixKeyType;
    if (pixKey) updateData.pixKey = pixKey;
    if (pixReceiverName) updateData.pixReceiverName = pixReceiverName;
    if (pixBankName) updateData.pixBankName = pixBankName;
    if (whatsappNumber) updateData.whatsappNumber = whatsappNumber;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;

    await db.update(tenants).set(updateData).where(eq(tenants.id, id));

    const updated = await db.select().from(tenants).where(eq(tenants.id, id));
    return NextResponse.json({ success: true, tenant: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
