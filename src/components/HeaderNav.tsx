"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { LoginModal } from "@/components/LoginModal";
import { TenantInfo } from "@/types";
import {
  ShoppingBag,
  MapPin,
  LogIn,
  SlidersHorizontal,
  ChevronDown,
  ChefHat,
  Layers,
  Building2,
  BookOpen,
  ShieldAlert,
  MonitorPlay,
  RotateCcw,
  UserCheck,
  Store,
  Lock,
} from "lucide-react";

interface HeaderNavProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onFilterClick?: () => void;
}

export function HeaderNav({ searchTerm, setSearchTerm, onFilterClick }: HeaderNavProps) {
  const {
    user,
    activeTenant,
    setActiveTenant,
    presentationMode,
    setPresentationMode,
    currentView,
    setCurrentView,
    cart,
    switchPersona,
    resetDemoData,
  } = useApp();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [tenantSelectorOpen, setTenantSelectorOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [tenantsList, setTenantsList] = useState<TenantInfo[]>([]);

  const isMaster = user?.role === "master";
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tenants) {
          setTenantsList(data.tenants);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#031B33]/95 backdrop-blur-md border-b border-[#165A8C]/30 text-white shadow-xl">
      {/* Banner de Modo Apresentação Ativo */}
      {presentationMode && (
        <div className="bg-gradient-to-r from-amber-600 via-[#F26522] to-amber-600 px-4 py-1.5 text-center text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-inner">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>MODO APRESENTAÇÃO — DADOS FICTÍCIOS ISOLADOS</span>
          <button
            onClick={() => setPresentationMode(false)}
            className="ml-3 underline bg-black/25 hover:bg-black/40 px-2 py-0.5 rounded text-[11px] transition"
          >
            Sair da Apresentação
          </button>
        </div>
      )}

      {/* Tarja de Isolamento de Tenant (Mostra explicitamente a loja atual) */}
      <div className="bg-[#021324] border-b border-[#165A8C]/20 px-4 py-1 text-[11px] flex items-center justify-between text-[#A3B8CC]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Espaço da Loja:</span>
            <strong className="text-white flex items-center gap-1">
              {activeTenant?.name}
              <span className="text-[10px] bg-[#165A8C]/60 text-slate-200 px-1.5 py-0.2 rounded font-mono">
                /{activeTenant?.slug}
              </span>
            </strong>
          </div>

          <div className="flex items-center gap-2">
            {isMaster ? (
              <span className="text-purple-300 font-bold bg-purple-950/80 border border-purple-700/60 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                👑 Você é Master: Acesso Global Total
              </span>
            ) : (
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#F26522]" />
                Escopo isolado para esta pizzaria
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Marca da Pizzaria Ativa */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setCurrentView("menu")}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#165A8C] to-[#031B33] p-1.5 border border-[#165A8C] shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                <img
                  src="/logo-icon.svg"
                  alt="PizzaHub Multi-Tenant Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tracking-tight text-white font-sans">
                    Pizza<span className="text-[#F26522]">Hub</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#A3B8CC] font-semibold">
                  <MapPin className="w-3 h-3 text-[#F26522] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-xs">
                    {activeTenant?.city}, {activeTenant?.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Seletor de Espaço / Pizzaria (Master pode alternar livremente) */}
            {isMaster && (
              <div className="relative ml-2">
                <button
                  onClick={() => setTenantSelectorOpen(!tenantSelectorOpen)}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/70 border border-purple-700/60 text-purple-200 text-xs font-bold hover:bg-purple-900 transition"
                  title="Master: Alternar entre lojas da rede"
                >
                  <Store className="w-3.5 h-3.5 text-purple-300" />
                  <span className="truncate max-w-[130px]">{activeTenant?.slug}</span>
                  <ChevronDown className="w-3 h-3 text-purple-400" />
                </button>

                {tenantSelectorOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-[#031B33] border border-purple-500 rounded-2xl shadow-2xl p-2 z-50">
                    <p className="text-[10px] uppercase font-bold text-purple-300 px-2 py-1">
                      Alternar Espaço da Pizzaria:
                    </p>
                    <div className="space-y-1">
                      {tenantsList.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setActiveTenant(t);
                            setTenantSelectorOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                            activeTenant?.id === t.id
                              ? "bg-purple-900/60 text-white font-bold"
                              : "text-[#A3B8CC] hover:bg-[#165A8C]/40 hover:text-white"
                          }`}
                        >
                          <div>
                            <div className="text-white">{t.name}</div>
                            <div className="text-[10px] text-slate-400">{t.city} • /{t.slug}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navegação de Módulos */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#092B4C]/80 border border-[#165A8C]/50 rounded-2xl p-1 text-xs">
            <button
              onClick={() => setCurrentView("menu")}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "menu"
                  ? "bg-[#F26522] text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <span>Cardápio & Loja</span>
            </button>

            <button
              onClick={() => setCurrentView("kds")}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "kds"
                  ? "bg-[#165A8C] text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Cozinha (KDS)</span>
            </button>

            <button
              onClick={() => setCurrentView("admin")}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "admin"
                  ? "bg-[#165A8C] text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F26522]" />
              <span>Gestão da Loja</span>
            </button>

            {/* Painel Master: Somente Master Global tem acesso e visualiza */}
            {isMaster && (
              <button
                onClick={() => setCurrentView("master")}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  currentView === "master"
                    ? "bg-purple-700 text-white shadow"
                    : "text-purple-300 hover:text-white hover:bg-purple-900/40"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-purple-300" />
                <span>Painel Master Global</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView("docs")}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "docs"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>
          </nav>

          {/* Ações da Direita */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Entrar */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#165A8C]/40 hover:bg-[#165A8C]/80 border border-[#165A8C]/60 text-white text-xs font-bold transition shadow"
              title="Entrar com e-mail e senha"
            >
              <LogIn className="w-3.5 h-3.5 text-[#F26522]" />
              <span>Entrar</span>
            </button>

            {/* Sacola / Carrinho */}
            <button
              onClick={() => setCurrentView("cart")}
              className="relative p-2.5 rounded-2xl bg-[#092B4C] hover:bg-[#165A8C]/60 border border-[#165A8C]/70 text-white transition flex items-center gap-2 shadow-md group"
              title="Ver Sacola de Compras"
            >
              <ShoppingBag className="w-5 h-5 text-[#F26522] group-hover:scale-110 transition" />
              <span className="hidden md:inline text-xs font-black">
                {cartItemsCount > 0 ? `${cartItemsCount}` : "Sacola"}
              </span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F26522] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#031B33] animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Persona Switcher / Avatar */}
            <div className="relative">
              <button
                onClick={() => setPersonaOpen(!personaOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-[#092B4C] hover:bg-[#165A8C]/60 border border-[#165A8C]/70 transition shadow"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow ${
                  isMaster ? "bg-purple-600" : "bg-gradient-to-br from-[#F26522] to-amber-600"
                }`}>
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "PH"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-white text-xs leading-tight truncate max-w-[100px]">
                    {user?.name?.split(" ")[0]}
                  </div>
                  <div className="text-[9px] text-[#A3B8CC] uppercase font-bold tracking-wider">
                    {user?.role === "master"
                      ? "Master Global"
                      : user?.role === "admin"
                      ? "Gerente Loja"
                      : user?.role === "staff"
                      ? "Cozinha"
                      : "Cliente"}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A3B8CC] hidden sm:block" />
              </button>

              {personaOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#031B33] border border-[#165A8C] rounded-2xl shadow-2xl p-2.5 z-50">
                  <div className="px-3 py-2 border-b border-[#165A8C]/40">
                    <p className="text-[11px] text-[#A3B8CC] font-medium">Troca Instantânea de Perfil:</p>
                    <p className="text-xs font-bold text-white">Demonstração de Permissões</p>
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => {
                        switchPersona("master");
                        setPersonaOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        user?.role === "master" ? "bg-purple-900/60 text-purple-200" : "hover:bg-[#165A8C]/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="font-bold">Admin Master Global</div>
                          <div className="text-[10px] text-purple-300">Acesso irrestrito a todas as pizzarias</div>
                        </div>
                      </div>
                      {user?.role === "master" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona("admin", activeTenant?.id);
                        setPersonaOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        user?.role === "admin" ? "bg-[#165A8C]/60 text-white" : "hover:bg-[#165A8C]/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#F26522]" />
                        <div>
                          <div className="font-bold">Gerente da Loja ({activeTenant?.name?.split("-")[1] || "Limoeiro"})</div>
                          <div className="text-[10px] text-[#A3B8CC]">Acesso restrito à própria pizzaria</div>
                        </div>
                      </div>
                      {user?.role === "admin" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona("staff", activeTenant?.id);
                        setPersonaOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        user?.role === "staff" ? "bg-[#165A8C]/60 text-white" : "hover:bg-[#165A8C]/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-bold">Cozinha / KDS da Loja</div>
                          <div className="text-[10px] text-[#A3B8CC]">Comandas e fornada da sua unidade</div>
                        </div>
                      </div>
                      {user?.role === "staff" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        switchPersona("customer", activeTenant?.id);
                        setPersonaOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${
                        user?.role === "customer" ? "bg-[#165A8C]/60 text-white" : "hover:bg-[#165A8C]/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="font-bold">Cliente Consumidor</div>
                          <div className="text-[10px] text-[#A3B8CC]">Comprar e enviar Pix no WhatsApp</div>
                        </div>
                      </div>
                      {user?.role === "customer" && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#165A8C]/40 flex gap-2">
                    <button
                      onClick={() => {
                        setPresentationMode(!presentationMode);
                        setPersonaOpen(false);
                      }}
                      className="flex-1 py-1.5 px-2 bg-gradient-to-r from-amber-600 to-[#F26522] rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1 shadow"
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      {presentationMode ? "Sair Apresentação" : "Modo Apresentação"}
                    </button>
                    <button
                      onClick={() => {
                        resetDemoData();
                        setPersonaOpen(false);
                      }}
                      className="p-1.5 bg-[#165A8C]/40 hover:bg-[#165A8C] rounded-xl text-white"
                      title="Reiniciar Demonstração"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="pb-4 pt-1">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar no cardápio de ${activeTenant?.name}...`}
                className="w-full bg-[#092B4C] border border-[#165A8C]/60 rounded-2xl pl-4 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition shadow-inner"
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
              className="p-3 bg-[#092B4C] hover:bg-[#165A8C]/60 border border-[#165A8C]/70 rounded-2xl text-[#A3B8CC] hover:text-white transition shadow shrink-0"
              title="Filtros"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#F26522]" />
            </button>
          </div>
        </div>

        {/* Barra Mobile de Navegação */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-[#165A8C]/30 text-xs">
          <button
            onClick={() => setCurrentView("menu")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "menu" ? "text-[#F26522] font-black" : "text-[#A3B8CC]"
            }`}
          >
            <span>Cardápio</span>
          </button>
          <button
            onClick={() => setCurrentView("kds")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "kds" ? "text-[#F26522] font-black" : "text-[#A3B8CC]"
            }`}
          >
            <span>Cozinha</span>
          </button>
          <button
            onClick={() => setCurrentView("admin")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "admin" ? "text-[#F26522] font-black" : "text-[#A3B8CC]"
            }`}
          >
            <span>Loja</span>
          </button>
          {isMaster && (
            <button
              onClick={() => setCurrentView("master")}
              className={`flex flex-col items-center gap-1 ${
                currentView === "master" ? "text-purple-400 font-black" : "text-purple-300"
              }`}
            >
              <span>Master</span>
            </button>
          )}
          <button
            onClick={() => setLoginModalOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <span>Entrar</span>
          </button>
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </header>
  );
}
