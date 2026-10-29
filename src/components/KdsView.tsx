"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { OrderData, OrderStatus } from "@/types";
import {
  ChefHat,
  Flame,
  CheckCircle,
  Bike,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Check,
  X,
  Lock,
  MapPin,
} from "lucide-react";

export function KdsView() {
  const { activeTenant, user, setCurrentView } = useApp();
  const [ordersList, setOrdersList] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("active");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Verificação de Acesso:
  // - Master Global: acesso total
  // - Staff/Admin da loja: acesso estrito à sua loja
  const isMaster = user?.role === "master";
  const isAuthorized = isMaster || (user?.tenantId === activeTenant?.id);

  const fetchOrders = async () => {
    if (!isAuthorized) return;
    try {
      const tenantId = activeTenant?.id || "tenant-limoeiro-01";
      const res = await fetch(`/api/orders?tenantId=${tenantId}`);
      const data = await res.json();
      if (data.success) {
        setOrdersList(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      if (autoRefresh) fetchOrders();
    }, 8000);
    return () => clearInterval(interval);
  }, [activeTenant, autoRefresh, user]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action: "update_status",
          status: newStatus,
          staffUserId: user?.id,
          staffUserName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyPix = async (orderId: string, approved: boolean) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          action: "verify_pix",
          approved,
          staffUserId: user?.id,
          staffUserName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-[#031B33] border border-rose-500/50 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Acesso Restrito: Cozinha Desta Loja</h2>
        <p className="text-xs text-[#A3B8CC]">
          Você não tem permissão para visualizar a esteira de produção e forno da unidade <strong>{activeTenant?.name}</strong>.
        </p>
        <button
          onClick={() => setCurrentView("menu")}
          className="px-6 py-2.5 rounded-xl bg-[#F26522] text-white font-bold text-xs shadow"
        >
          Voltar para o Cardápio
        </button>
      </div>
    );
  }

  const filteredOrders = ordersList.filter((ord) => {
    if (filterStatus === "active") {
      return ["PENDING", "RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(ord.status);
    }
    if (filterStatus === "pix_pending") {
      return ord.paymentStatus === "PENDING_VERIFICATION";
    }
    if (filterStatus === "delivered") {
      return ord.status === "DELIVERED";
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header KDS da Loja */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#031B33] border border-[#165A8C]/50 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F26522]/20 border border-[#F26522]/40 rounded-xl text-[#F26522]">
            <ChefHat className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">
                KDS — Cozinha & Fornada
              </h1>
              <span className="text-[10px] font-bold bg-[#165A8C] text-white px-2 py-0.5 rounded-full uppercase">
                {activeTenant?.name}
              </span>
            </div>
            <p className="text-xs text-[#A3B8CC]">
              Espaço de produção exclusivo da unidade em {activeTenant?.city}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === "active"
                ? "bg-[#F26522] text-white"
                : "bg-[#092B4C] text-[#A3B8CC] hover:text-white"
            }`}
          >
            Fila Ativa ({ordersList.filter((o) => ["PENDING", "RECEIVED", "PREPARING", "READY", "OUT_FOR_DELIVERY"].includes(o.status)).length})
          </button>

          <button
            onClick={() => setFilterStatus("pix_pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              filterStatus === "pix_pending"
                ? "bg-amber-600 text-white"
                : "bg-[#092B4C] text-amber-400 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pix Pendente ({ordersList.filter((o) => o.paymentStatus === "PENDING_VERIFICATION").length})</span>
          </button>

          <button
            onClick={() => setFilterStatus("delivered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === "delivered"
                ? "bg-emerald-600 text-white"
                : "bg-[#092B4C] text-[#A3B8CC] hover:text-white"
            }`}
          >
            Finalizados
          </button>

          <button
            onClick={fetchOrders}
            className="p-2 bg-[#165A8C]/40 hover:bg-[#165A8C] rounded-lg text-white"
            title="Atualizar Pedidos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid de Pedidos */}
      {loading ? (
        <div className="py-20 text-center text-[#A3B8CC]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#F26522]" />
          <p>Carregando comandas da cozinha...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#031B33]/40 border border-[#165A8C]/30 rounded-3xl text-[#A3B8CC]">
          <ChefHat className="w-12 h-12 text-[#165A8C] mx-auto mb-2 opacity-50" />
          <p className="font-bold">Nenhum pedido pendente na cozinha de {activeTenant?.name}!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((ord) => {
            const isPendingPix = ord.paymentStatus === "PENDING_VERIFICATION";
            const isConfirmedPix = ord.paymentStatus === "CONFIRMED";

            return (
              <div
                key={ord.id}
                className={`bg-[#031B33] border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                  isPendingPix
                    ? "border-amber-500/80 ring-1 ring-amber-500/30"
                    : ord.status === "PREPARING"
                    ? "border-[#F26522] ring-1 ring-[#F26522]/30"
                    : "border-[#165A8C]/60"
                }`}
              >
                {/* Cabeçalho */}
                <div className="p-4 bg-[#092B4C]/80 border-b border-[#165A8C]/40 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white">{ord.code}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#165A8C] text-[#A3B8CC] uppercase">
                        {ord.deliveryType === "delivery"
                          ? "Entrega"
                          : ord.deliveryType === "pickup"
                          ? "Retirada"
                          : `Mesa ${ord.tableNumber || "01"}`}
                      </span>
                    </div>
                    <p className="text-xs text-[#A3B8CC] font-semibold mt-0.5">
                      {ord.customerName} • {ord.customerPhone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-white block">
                      R$ {parseFloat(ord.totalAmount).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Pix Conferência */}
                <div
                  className={`px-4 py-2 text-xs flex items-center justify-between ${
                    isConfirmedPix
                      ? "bg-emerald-950/40 text-emerald-300 border-b border-emerald-800/40"
                      : "bg-amber-950/50 text-amber-200 border-b border-amber-800/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      {isConfirmedPix ? "Pix Confirmado" : "Pix Aguardando Conferência"}
                    </span>
                  </div>

                  {isPendingPix && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleVerifyPix(ord.id, true)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow"
                        title="Aprovar Pix no WhatsApp"
                      >
                        <Check className="w-3 h-3" />
                        <span>Aprovar</span>
                      </button>
                      <button
                        onClick={() => handleVerifyPix(ord.id, false)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-[11px]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Itens */}
                <div className="p-4 flex-1 space-y-2.5 text-xs">
                  {ord.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#092B4C]/40 border border-[#165A8C]/30"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-sm">
                          {item.quantity}x {item.productName}
                        </span>
                        {item.size && (
                          <span className="text-[10px] bg-[#F26522]/20 text-[#F26522] font-black px-1.5 py-0.5 rounded uppercase">
                            {item.size}
                          </span>
                        )}
                      </div>

                      {item.secondFlavor && (
                        <p className="text-amber-400 font-semibold text-xs mt-0.5">
                          🍕 Meio a Meio: {item.secondFlavor}
                        </p>
                      )}

                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[#A3B8CC] text-[11px] mt-0.5">
                          Borda: {item.selectedAddons.map((b) => b.name).join(", ")}
                        </p>
                      )}

                      {item.notes && (
                        <p className="text-rose-300 text-[11px] mt-1 italic font-medium bg-rose-950/20 p-1 rounded">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {ord.deliveryType === "delivery" && ord.addressStreet && (
                    <div className="text-[11px] text-[#A3B8CC] pt-1">
                      📍 {ord.addressStreet}, {ord.addressNumber} - {ord.addressNeighborhood}
                    </div>
                  )}
                </div>

                {/* Ações da Cozinha */}
                <div className="p-3 bg-[#092B4C] border-t border-[#165A8C]/40">
                  <div className="grid grid-cols-2 gap-2">
                    {ord.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "PREPARING")}
                        className="col-span-2 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#F26522]/90 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <Flame className="w-4 h-4" />
                        <span>Colocar no Forno (Preparar)</span>
                      </button>
                    )}

                    {ord.status === "PREPARING" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "READY")}
                        className="col-span-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Pronto na Bancada</span>
                      </button>
                    )}

                    {ord.status === "READY" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "OUT_FOR_DELIVERY")}
                          className="py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Saiu Entrega</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, "DELIVERED")}
                          className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Entregue</span>
                        </button>
                      </>
                    )}

                    {ord.status === "OUT_FOR_DELIVERY" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "DELIVERED")}
                        className="col-span-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirmar Entrega Concluída</span>
                      </button>
                    )}

                    {ord.status === "DELIVERED" && (
                      <div className="col-span-2 text-center text-xs text-emerald-400 font-bold py-1">
                        ✓ Pedido Concluído e Entregue
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
