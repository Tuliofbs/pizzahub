import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedInitialData();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    const query = tenantId
      ? await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          tenantId: users.tenantId,
          phone: users.phone,
          active: users.active,
        }).from(users).where(eq(users.tenantId, tenantId))
      : await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          tenantId: users.tenantId,
          phone: users.phone,
          active: users.active,
        }).from(users);

    return NextResponse.json({ success: true, users: query });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const { name, email, password, role, tenantId, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Nome, e-mail e senha são obrigatórios." }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "E-mail já cadastrado." }, { status: 400 });
    }

    const id = `user-${Date.now()}`;
    const newUser = {
      id,
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || "staff",
      tenantId: tenantId || null,
      phone: phone || "",
      googleAuth: false,
      active: true,
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
