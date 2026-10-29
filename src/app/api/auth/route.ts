import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function POST(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const { email, password, action, name, phone, role, tenantId } = body;

    // Ação 1: Login com credenciais
    if (action === "login") {
      if (!email) {
        return NextResponse.json({ success: false, error: "Informe o e-mail" }, { status: 400 });
      }

      const found = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
      if (found.length === 0) {
        return NextResponse.json({ success: false, error: "Usuário não encontrado." }, { status: 401 });
      }

      const user = found[0];
      if (password && user.password !== password) {
        return NextResponse.json({ success: false, error: "Senha incorreta." }, { status: 401 });
      }

      let tenant = null;
      if (user.tenantId) {
        const t = await db.select().from(tenants).where(eq(tenants.id, user.tenantId));
        if (t.length > 0) tenant = t[0];
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          phone: user.phone,
          googleAuth: user.googleAuth,
        },
        tenant,
      });
    }

    // Ação 2: Login Google simulado/OAuth
    if (action === "google_login") {
      const gEmail = email ? email.trim().toLowerCase() : `google.user.${Date.now()}@gmail.com`;
      let found = await db.select().from(users).where(eq(users.email, gEmail));
      
      let user;
      if (found.length === 0) {
        const id = `user-g-${Date.now()}`;
        const newUser = {
          id,
          name: name || "Cliente Google",
          email: gEmail,
          password: "google_oauth_token",
          role: "customer", // Clientes cadastram livremente como customer
          tenantId: tenantId || "tenant-limoeiro-01",
          phone: phone || "(88) 99999-8888",
          googleAuth: true,
          active: true,
        };
        await db.insert(users).values(newUser);
        user = newUser;
      } else {
        user = found[0];
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          phone: user.phone,
          googleAuth: true,
        },
      });
    }

    // Ação 3: Cadastro livre (Customer) ou com aprovação
    if (action === "register") {
      if (!email || !name) {
        return NextResponse.json({ success: false, error: "Preencha todos os campos obrigatórios." }, { status: 400 });
      }

      const found = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
      if (found.length > 0) {
        return NextResponse.json({ success: false, error: "E-mail já cadastrado no PizzaHub." }, { status: 400 });
      }

      const assignedRole = role === "master" ? "customer" : (role || "customer"); // Master não pode ser escolhido publicamente
      const id = `user-${Date.now()}`;
      const newUser = {
        id,
        name,
        email: email.trim().toLowerCase(),
        password: password || "123456",
        role: assignedRole,
        tenantId: tenantId || "tenant-limoeiro-01",
        phone: phone || "",
        googleAuth: false,
        active: true,
      };

      await db.insert(users).values(newUser);

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          tenantId: newUser.tenantId,
          phone: newUser.phone,
        },
      });
    }

    // Ação 4: Troca rápida de Persona para validação / testes funcionais
    if (action === "switch_persona") {
      const targetRole = role; // 'master', 'admin', 'staff', 'customer'
      const found = await db.select().from(users).where(eq(users.role, targetRole));
      if (found.length > 0) {
        const u = found[0];
        let tenant = null;
        if (u.tenantId) {
          const t = await db.select().from(tenants).where(eq(tenants.id, u.tenantId));
          if (t.length > 0) tenant = t[0];
        }
        return NextResponse.json({
          success: true,
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            tenantId: u.tenantId,
            phone: u.phone,
          },
          tenant,
        });
      }
      return NextResponse.json({ success: false, error: "Usuário padrão não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: "Ação inválida." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
