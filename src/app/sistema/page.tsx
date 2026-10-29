"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppProvider, useApp } from "@/context/AppContext";
import { SistemaHeader } from "@/components/SistemaHeader";
import { AdminView } from "@/components/AdminView";
import { KdsView } from "@/components/KdsView";
import { MasterView } from "@/components/MasterView";
import { DocsView } from "@/components/DocsView";
import {
  Layers,
  ChefHat,
  Building2,
  BookOpen,
  ArrowUpRight,
  Shield,
  Palette,
  Store,
  DollarSign,
  Lock,
} from "lucide-react";

function SistemaContent() {
  const { currentView, setCurrentView, activeTenant, user } = useApp();
  const isMaster = user?.role === "master";

  return (
    <div className="min-h-screen bg-[#031B33] text-white flex flex-col justify-between selection:bg-[#F26522] selection:text-white">
      {/* Cabeçalho do Sistema de Gestão */}
      <SistemaHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hub de Módulos Operacionais */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#092B4C]/70 border border-[#165A8C]/40 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#165A8C]/50 border border-[#165A8C]">
              <Store className="w-5 h-5 text-[#F26522]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white">
                  Sistema de Operação & Backoffice
                </h2>
                <span className="text-[10px] font-bold bg-[#165A8C] text-[#A3B8CC] px-2 py-0.5 rounded-full uppercase">
                  Painel Interno
                </span>
              </div>
              <p className="text-xs text-[#A3B8CC]">
                Empresa Ativa: <strong className="text-white">{activeTenant?.name}</strong> ({activeTenant?.city})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("admin")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentView === "admin"
                  ? "bg-[#F26522] text-white shadow"
                  : "bg-[#031B33] text-[#A3B8CC] hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cores & Cards da Loja</span>
            </button>

            <button
              onClick={() => setCurrentView("kds")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentView === "kds"
                  ? "bg-[#F26522] text-white shadow"
                  : "bg-[#031B33] text-[#A3B8CC] hover:text-white"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Cozinha / KDS</span>
            </button>

            {isMaster && (
              <button
                onClick={() => setCurrentView("master")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  currentView === "master"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-[#031B33] text-purple-300 hover:text-white"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Master Global</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow"
              title="Abrir a vitrine de compras em nova aba"
            >
              <span>Abrir Vitrine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Módulos do Sistema de Gestão */}
        {(currentView === "admin" || currentView === "menu" || currentView === "cart" || currentView === "order_success") && (
          <AdminView />
        )}
        {currentView === "kds" && <KdsView />}
        {currentView === "master" && <MasterView />}
        {currentView === "docs" && <DocsView />}
      </main>

      {/* Rodapé do Sistema */}
      <footer className="border-t border-[#165A8C]/30 bg-[#021324] py-6 text-center text-xs text-[#A3B8CC]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">PizzaHub SaaS Multi-Tenant Control</span>
            <span>— Módulo de Gestão da Empresa {activeTenant?.name}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setCurrentView("docs")} className="hover:underline">
              Documentação do Sistema
            </button>
            <span>•</span>
            <Link href="/" className="text-[#F26522] hover:underline font-bold">
              Ir para a Vitrine de Clientes
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SistemaPage() {
  return (
    <AppProvider>
      <SistemaContent />
    </AppProvider>
  );
}
