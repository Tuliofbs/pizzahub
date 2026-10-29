"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { LoginModal } from "@/components/LoginModal";
import { TenantInfo } from "@/types";
import {
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
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  LogOut,
} from "lucide-react";

export function SistemaHeader() {
  const {
    user,
    setUser,
    activeTenant,
    setActiveTenant,
    presentationMode,
    setPresentationMode,
    currentView,
    setCurrentView,
    switchPersona,
    resetDemoData,
  } = useApp();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [tenantSelectorOpen, setTenantSelectorOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [tenantsList, setTenantsList] = useState<TenantInfo[]>([]);

  const isMaster = user?.role === "master";

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
    <header className="sticky top-0 z-50 bg-[#031B33] border-b border-[#165A8C]/40 text-white shadow-2xl">
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

      {/* Barra de Status e Contexto do Sistema PizzaHub */}
      <div className="bg-[#021324] border-b border-[#165A8C]/30 px-4 py-1.5 text-[11px] text-[#A3B8CC]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Sistema PizzaHub Operando:</span>
            <strong className="text-white bg-[#165A8C]/50 px-2 py-0.5 rounded border border-[#165A8C]">
              {activeTenant?.name}
            </strong>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[#F26522] hover:underline font-bold flex items-center gap-1"
              title="Abrir a vitrine de compras pública voltada para clientes"
            >
              <span>Ver Vitrine de Vendas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {isMaster ? (
              <span className="text-purple-300 font-bold bg-purple-950/80 border border-purple-700/60 px-2 py-0.5 rounded text-[10px] hidden sm:flex items-center gap-1">
                👑 Master Global: Acesso Total
              </span>
            ) : (
              <span className="text-slate-400 text-[10px] hidden sm:flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#F26522]" />
                Escopo Restrito à Loja
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo do Aplicativo PizzaHub (Painel Operacional) */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setCurrentView("admin")}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#165A8C] to-[#031B33] p-1.5 border border-[#165A8C] shadow-lg group-hover:scale-105 transition flex items-center justify-center">
                <img
                  src="/logo-icon.svg"
                  alt="PizzaHub Multi-Tenant Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white font-sans">
                    Pizza<span className="text-[#F26522]">Hub</span>
                  </span>
                  <span className="text-[10px] font-bold bg-purple-900/60 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded-full uppercase">
                    Painel Gestão
                  </span>
                </div>
                <div className="text-[11px] text-[#A3B8CC] font-semibold truncate max-w-[200px]">
                  Loja: {activeTenant?.name}
                </div>
              </div>
            </div>

            {/* Seletor de Empresa (Disponível quando é Master Global) */}
            {isMaster && (
              <div className="relative ml-2 hidden md:block">
                <button
                  onClick={() => setTenantSelectorOpen(!tenantSelectorOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-200 text-xs font-bold hover:bg-purple-900 transition"
                  title="Master: Selecionar qual empresa gerenciar"
                >
                  <Store className="w-3.5 h-3.5 text-purple-300" />
                  <span className="truncate max-w-[140px]">{activeTenant?.name?.split(" ")[0]}</span>
                  <ChevronDown className="w-3 h-3 text-purple-400" />
                </button>

                {tenantSelectorOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-[#031B33] border border-purple-500 rounded-2xl shadow-2xl p-2 z-50">
                    <p className="text-[10px] uppercase font-bold text-purple-300 px-2 py-1">
                      Alternar Empresa no Sistema:
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
                              ? "bg-purple-900/70 text-white font-bold"
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

          {/* Navegação entre Módulos Internos do Restaurante */}
          <nav className="hidden md:flex items-center gap-2 bg-[#092B4C]/80 border border-[#165A8C]/50 rounded-2xl p-1 text-xs">
            <button
              onClick={() => setCurrentView("admin")}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "admin"
                  ? "bg-[#165A8C] text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F26522]" />
              <span>Gestão da Empresa & Cards</span>
            </button>

            <button
              onClick={() => setCurrentView("kds")}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "kds"
                  ? "bg-[#165A8C] text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Cozinha & Forno (KDS)</span>
            </button>

            {/* Módulo Master Global */}
            {isMaster && (
              <button
                onClick={() => setCurrentView("master")}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
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
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                currentView === "docs"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-[#A3B8CC] hover:text-white hover:bg-[#165A8C]/40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Arquitetura & Docs</span>
            </button>
          </nav>

          {/* Persona Switcher / Login do Sistema */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#165A8C]/40 hover:bg-[#165A8C]/80 border border-[#165A8C]/60 text-white text-xs font-bold transition"
            >
              Trocar Login
            </button>

            <div className="relative">
              <button
                onClick={() => setPersonaOpen(!personaOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-[#092B4C] hover:bg-[#165A8C]/60 border border-[#165A8C]/70 transition shadow"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow ${
                    isMaster ? "bg-purple-600" : "bg-gradient-to-br from-[#F26522] to-amber-600"
                  }`}
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "PH"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-white text-xs leading-tight truncate max-w-[110px]">
                    {user?.name?.split(" ")[0]}
                  </div>
                  <div className="text-[9px] text-[#A3B8CC] uppercase font-bold tracking-wider">
                    {user?.role === "master"
                      ? "Master Global"
                      : user?.role === "admin"
                      ? "Gerente Loja"
                      : "Staff Cozinha"}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A3B8CC]" />
              </button>

              {personaOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#031B33] border border-[#165A8C] rounded-2xl shadow-2xl p-2.5 z-50">
                  <div className="px-3 py-2 border-b border-[#165A8C]/40">
                    <p className="text-[11px] text-[#A3B8CC] font-medium">Troca Instantânea de Perfil:</p>
                    <p className="text-xs font-bold text-white">Simulador de Acesso ao Sistema</p>
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
                          <div className="text-[10px] text-purple-300">Acesso irrestrito a todas as empresas</div>
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
                          <div className="font-bold">Gerente da Empresa ({activeTenant?.name?.split(" ")[0]})</div>
                          <div className="text-[10px] text-[#A3B8CC]">Edição de cards, cores e conferência Pix</div>
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
                          <div className="text-[10px] text-[#A3B8CC]">Esteira de pedidos e fornada</div>
                        </div>
                      </div>
                      {user?.role === "staff" && <UserCheck className="w-4 h-4 text-emerald-400" />}
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
                      {presentationMode ? "Sair Modo Apresentação" : "Modo Apresentação"}
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

        {/* Barra Mobile do Sistema */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#165A8C]/30 text-xs">
          <button
            onClick={() => setCurrentView("admin")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "admin" ? "text-[#F26522] font-black" : "text-[#A3B8CC]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gestão Loja</span>
          </button>
          <button
            onClick={() => setCurrentView("kds")}
            className={`flex flex-col items-center gap-1 ${
              currentView === "kds" ? "text-[#F26522] font-black" : "text-[#A3B8CC]"
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Cozinha</span>
          </button>
          {isMaster && (
            <button
              onClick={() => setCurrentView("master")}
              className={`flex flex-col items-center gap-1 ${
                currentView === "master" ? "text-purple-400 font-black" : "text-purple-300"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Master</span>
            </button>
          )}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-slate-300"
          >
            <ArrowUpRight className="w-4 h-4 text-[#F26522]" />
            <span>Vitrine</span>
          </Link>
        </div>
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </header>
  );
}
