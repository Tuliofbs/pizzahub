"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppProvider, useApp } from "@/context/AppContext";
import { VitrineHeader } from "@/components/VitrineHeader";
import { MenuView } from "@/components/MenuView";
import { CartView } from "@/components/CartView";
import { OrderSuccessView } from "@/components/OrderSuccessView";
import { Lock, Store, ArrowRight, ShieldCheck } from "lucide-react";

function VitrineContent() {
  const { currentView, activeTenant } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const tenantPrimary = activeTenant?.primaryColor || "#031B33";
  const tenantAccent = activeTenant?.accentColor || "#F26522";

  return (
    <div
      className="min-h-screen text-white flex flex-col justify-between selection:text-white"
      style={{
        backgroundColor: tenantPrimary,
        color: "#FFFFFF",
      }}
    >
      {/* Cabeçalho Limpo e Focado em Compras da Vitrine */}
      <VitrineHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Conteúdo da Vitrine: Cardápio, Carrinho e Confirmação com Pix no WhatsApp */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === "menu" && <MenuView searchTerm={searchTerm} />}
        {currentView === "cart" && <CartView />}
        {currentView === "order_success" && <OrderSuccessView />}
      </main>

      {/* Rodapé da Vitrine de Vendas */}
      <footer className="border-t border-white/10 bg-black/40 py-8 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">{activeTenant?.name}</span>
            <span>— {activeTenant?.city}, {activeTenant?.state}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Horário: {activeTenant?.openingHours}</span>
            <span>•</span>
            <Link
              href="/sistema"
              className="text-slate-300 hover:text-white underline font-semibold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" style={{ color: tenantAccent }} />
              <span>Painel do Restaurante</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <VitrineContent />
    </AppProvider>
  );
}
