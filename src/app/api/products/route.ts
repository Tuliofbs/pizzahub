import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function POST(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const { tenantId, categoryId, name, description, price, promotionalPrice, imageUrl, isPizza, sizesAvailable } = body;

    if (!tenantId || !name || !price) {
      return NextResponse.json({ success: false, error: "Dados incompletos." }, { status: 400 });
    }

    const id = `prod-${Date.now()}`;
    const newProd = {
      id,
      tenantId,
      categoryId: categoryId || "cat-pizzas-02",
      name,
      description: description || "",
      price: price.toString(),
      promotionalPrice: promotionalPrice ? promotionalPrice.toString() : null,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: !!isPizza,
      sizesAvailable: sizesAvailable || ["Média", "Grande"],
      sortOrder: 1,
    };

    await db.insert(products).values(newProd);
    return NextResponse.json({ success: true, product: newProd });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const { id, name, description, price, promotionalPrice, imageUrl, available, isPizza, sizesAvailable } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID do produto obrigatório." }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = price.toString();
    if (promotionalPrice !== undefined) updateData.promotionalPrice = promotionalPrice ? promotionalPrice.toString() : null;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (available !== undefined) updateData.available = available;
    if (isPizza !== undefined) updateData.isPizza = isPizza;
    if (sizesAvailable !== undefined) updateData.sizesAvailable = sizesAvailable;

    await db.update(products).set(updateData).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await seedInitialData();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID obrigatório." }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
