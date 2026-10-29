import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, tenants, auditLogs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { seedInitialData } from "@/db/seed";

export async function GET(req: Request) {
  try {
    await seedInitialData();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    let query = db.select().from(orders);

    let whereClause = undefined;
    if (tenantId && customerId) {
      whereClause = and(eq(orders.tenantId, tenantId), eq(orders.customerId, customerId));
    } else if (tenantId) {
      whereClause = eq(orders.tenantId, tenantId);
    } else if (customerId) {
      whereClause = eq(orders.customerId, customerId);
    }

    const orderList = whereClause 
      ? await db.select().from(orders).where(whereClause).orderBy(desc(orders.createdAt))
      : await db.select().from(orders).orderBy(desc(orders.createdAt));

    // Carregar itens para cada pedido
    const ordersWithItems = await Promise.all(
      orderList.map(async (ord) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, ord.id));
        const t = await db.select().from(tenants).where(eq(tenants.id, ord.tenantId));
        return {
          ...ord,
          items,
          tenant: t[0] || null,
        };
      })
    );

    return NextResponse.json({ success: true, orders: ordersWithItems });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const {
      tenantId,
      customerId,
      customerName,
      customerPhone,
      deliveryType,
      addressStreet,
      addressNumber,
      addressNeighborhood,
      addressCity,
      addressComplement,
      tableNumber,
      items,
      notes,
    } = body;

    if (!tenantId || !customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Dados incompletos para criação do pedido." }, { status: 400 });
    }

    const tList = await db.select().from(tenants).where(eq(tenants.id, tenantId));
    if (tList.length === 0) {
      return NextResponse.json({ success: false, error: "Unidade da pizzaria não encontrada." }, { status: 404 });
    }
    const tenant = tList[0];

    // Calcular valores no servidor para garantir integridade financeira
    let subtotalNumber = 0;
    const processedItems: any[] = [];

    for (const it of items) {
      const unit = parseFloat(it.unitPrice || "0");
      const qty = parseInt(it.quantity || "1", 10);
      let itemTotal = unit * qty;

      if (it.selectedAddons && Array.isArray(it.selectedAddons)) {
        for (const ad of it.selectedAddons) {
          itemTotal += (ad.price || 0) * qty;
        }
      }

      subtotalNumber += itemTotal;
      processedItems.push({
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId: it.productId || null,
        productName: it.productName,
        quantity: qty,
        unitPrice: unit.toFixed(2),
        totalPrice: itemTotal.toFixed(2),
        size: it.size || null,
        selectedAddons: it.selectedAddons || [],
        secondFlavor: it.secondFlavor || null,
        notes: it.notes || null,
      });
    }

    const deliveryFeeNum = deliveryType === "delivery" ? parseFloat(tenant.deliveryFee) : 0;
    const discountNum = 0.0;
    const totalAmountNum = subtotalNumber + deliveryFeeNum - discountNum;

    const orderId = `ord-${Date.now()}`;
    const code = `#PZ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      code,
      tenantId,
      customerId: customerId || null,
      customerName,
      customerPhone,
      deliveryType: deliveryType || "delivery",
      addressStreet: addressStreet || null,
      addressNumber: addressNumber || null,
      addressNeighborhood: addressNeighborhood || null,
      addressCity: addressCity || tenant.city,
      addressComplement: addressComplement || null,
      tableNumber: tableNumber || null,
      subtotal: subtotalNumber.toFixed(2),
      deliveryFee: deliveryFeeNum.toFixed(2),
      discount: discountNum.toFixed(2),
      totalAmount: totalAmountNum.toFixed(2),
      paymentMethod: "PIX_MANUAL",
      paymentStatus: "PENDING_VERIFICATION",
      pixReceiptInfo: "Aguardando envio do comprovante pelo cliente",
      pixConfirmedByUserId: null,
      pixConfirmedAt: null,
      status: "PENDING",
      notes: notes || null,
    };

    await db.insert(orders).values(newOrder);

    // Inserir itens vinculados
    for (const pItem of processedItems) {
      await db.insert(orderItems).values({
        ...pItem,
        orderId,
      });
    }

    // Registrar log de auditoria
    await db.insert(auditLogs).values({
      id: `log-${Date.now()}`,
      tenantId,
      userId: customerId || "guest",
      userName: customerName,
      action: "ORDER_CREATED",
      details: `Novo pedido ${code} criado no valor de R$ ${totalAmountNum.toFixed(2)} (${deliveryType})`,
    });

    return NextResponse.json({
      success: true,
      order: {
        ...newOrder,
        items: processedItems,
        tenant,
      },
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await seedInitialData();
    const body = await req.json();
    const { orderId, action, status, pixReceiptInfo, staffUserId, staffUserName, notes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "ID do pedido não informado." }, { status: 400 });
    }

    const found = await db.select().from(orders).where(eq(orders.id, orderId));
    if (found.length === 0) {
      return NextResponse.json({ success: false, error: "Pedido não encontrado." }, { status: 404 });
    }
    const currentOrder = found[0];

    // Ação: Cliente envia comprovante Pix
    if (action === "submit_pix_receipt") {
      await db.update(orders).set({
        pixReceiptInfo: pixReceiptInfo || "Comprovante Pix anexado pelo cliente",
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId));

      return NextResponse.json({ success: true, message: "Comprovante recebido para conferência." });
    }

    // Ação: Funcionário / Admin Confirma ou Rejeita o Pix Manual
    if (action === "verify_pix") {
      const isApproved = body.approved === true;
      const newPaymentStatus = isApproved ? "CONFIRMED" : "REJECTED";
      const newOrderStatus = isApproved && currentOrder.status === "PENDING" ? "RECEIVED" : currentOrder.status;

      await db.update(orders).set({
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        pixConfirmedByUserId: staffUserId || null,
        pixConfirmedAt: isApproved ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId));

      await db.insert(auditLogs).values({
        id: `log-${Date.now()}`,
        tenantId: currentOrder.tenantId,
        userId: staffUserId || "staff",
        userName: staffUserName || "Equipe",
        action: isApproved ? "PIX_MANUAL_CONFIRMED" : "PIX_MANUAL_REJECTED",
        details: `Pix do pedido ${currentOrder.code} no valor de R$ ${currentOrder.totalAmount} foi ${isApproved ? "CONFERIDO E CONFIRMADO" : "REJEITADO"}`,
      });

      return NextResponse.json({ success: true, paymentStatus: newPaymentStatus, status: newOrderStatus });
    }

    // Ação: Mudança de status da cozinha / entrega (KDS)
    if (action === "update_status") {
      if (!status) {
        return NextResponse.json({ success: false, error: "Novo status não informado." }, { status: 400 });
      }

      await db.update(orders).set({
        status,
        updatedAt: new Date(),
      }).where(eq(orders.id, orderId));

      await db.insert(auditLogs).values({
        id: `log-${Date.now()}`,
        tenantId: currentOrder.tenantId,
        userId: staffUserId || "staff",
        userName: staffUserName || "Equipe",
        action: "ORDER_STATUS_CHANGED",
        details: `Pedido ${currentOrder.code} mudou de ${currentOrder.status} para ${status}`,
      });

      return NextResponse.json({ success: true, status });
    }

    return NextResponse.json({ success: false, error: "Ação não suportada." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
