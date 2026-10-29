"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  ShoppingBag,
  SlidersHorizontal,
  MapPin,
  Lock,
  ChevronDown,
} from "lucide-react";

interface VitrineHeaderProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onFilterClick?: () => void;
}

export function VitrineHeader({ searchTerm, setSearchTerm, onFilterClick }: VitrineHeaderProps) {
  const { activeTenant, cart, setCurrentView, currentView } = useApp();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tenantAccent = activeTenant?.accentColor || "#F26522";
  const tenantPrimary = activeTenant?.primaryColor || "#031B33";

  return (
    <header
      className="sticky top-0 z-50 text-white shadow-2xl border-b border-white/10 backdrop-blur-md"
      style={{ backgroundColor: `${tenantPrimary}F2` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Marca / Identidade da Pizzaria (Exclusiva desta vitrine de vendas) */}
          <div
            onClick={() => setCurrentView("menu")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className="w-12 h-12 rounded-2xl p-2 flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition"
              style={{ backgroundColor: tenantAccent }}
            >
              <img
                src="/logo-icon.svg"
                alt="Logotipo"
                className="w-full h-full object-contain filter invert brightness-0"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans leading-none">
                  {activeTenant?.name}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: tenantAccent }} />
                <span>
                  {activeTenant?.city}, {activeTenant?.state} • Cardápio & Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Apenas Carrinho/Sacola do Cliente + Link Discreto para o Painel Administrativo */}
          <div className="flex items-center gap-3">
            {/* Sacola de Pedidos do Cliente */}
            <button
              onClick={() => setCurrentView("cart")}
              className="relative px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center gap-2.5 shadow-md active:scale-95"
              title="Ver Sacola de Compras"
            >
              <ShoppingBag className="w-5 h-5" style={{ color: tenantAccent }} />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-300 block leading-tight">
                  Sua Sacola
                </span>
                <span className="text-xs font-black text-white">
                  {cartItemsCount > 0 ? `${cartItemsCount} item(s)` : "Vazia"}
                </span>
              </div>
              {cartItemsCount > 0 && (
                <span
                  className="sm:hidden absolute -top-1.5 -right-1.5 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-pulse"
                  style={{ backgroundColor: tenantAccent }}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Acesso ao Sistema / Gestão (Leva para /sistema) */}
            <Link
              href="/sistema"
              className="px-3.5 py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/15 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              title="Acessar o Sistema de Gestão Interno (Cozinha, Gerência, Master)"
            >
              <Lock className="w-3.5 h-3.5" style={{ color: tenantAccent }} />
              <span className="hidden md:inline">Área do Restaurante</span>
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa de Pratos do Cardápio */}
        {currentView === "menu" && (
          <div className="pb-4 pt-1">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Buscar pizzas, massas, bebidas e lanches em ${activeTenant?.name}...`}
                  className="w-full bg-black/40 border border-white/20 rounded-2xl pl-4 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white transition shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={onFilterClick}
                className="p-3 bg-black/40 hover:bg-black/60 border border-white/20 rounded-2xl text-slate-300 hover:text-white transition shadow shrink-0"
                title="Filtros"
              >
                <SlidersHorizontal className="w-4 h-4" style={{ color: tenantAccent }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
