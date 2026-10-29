"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Lock, Mail, KeyRound, ShieldAlert, CheckCircle, ArrowRight, UserCheck } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { setUser, setActiveTenant, setCurrentView } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        if (data.tenant) {
          setActiveTenant(data.tenant);
        }

        // Redireciona conforme o papel
        if (data.user.role === "master") {
          setCurrentView("master");
        } else if (data.user.role === "admin") {
          setCurrentView("admin");
        } else if (data.user.role === "staff") {
          setCurrentView("kds");
        } else {
          setCurrentView("menu");
        }

        onClose();
      } else {
        setError(data.error || "Credenciais inválidas. Verifique seu e-mail e senha.");
      }
    } catch (err: any) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#031B33] border border-[#165A8C] rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#165A8C] to-[#031B33] border border-[#165A8C] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-6 h-6 text-[#F26522]" />
          </div>
          <h2 className="text-2xl font-black text-white">Entrar no PizzaHub</h2>
          <p className="text-xs text-[#A3B8CC] mt-1">
            Autenticação Multi-Tenant com controle de permissões
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#A3B8CC] uppercase mb-1 block">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#A3B8CC]" />
              <input
                type="email"
                required
                placeholder="seu.email@pizzahub.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F26522]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#A3B8CC] uppercase mb-1 block">
              Senha
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#A3B8CC]" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F26522]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F26522] hover:bg-[#F26522]/90 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F26522]/30 active:scale-95 transition"
          >
            {loading ? "Verificando..." : "Entrar no Painel"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Guia com botões de 1-clique para preenchimento rápido */}
        <div className="mt-6 pt-5 border-t border-[#165A8C]/40">
          <p className="text-[11px] font-bold text-[#A3B8CC] uppercase text-center mb-2.5">
            🔑 Credenciais Pré-configuradas (Clique para Preencher):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleQuickFill("master@pizzahub.com.br", "masterpassword123")}
              className="p-2 rounded-lg bg-[#092B4C]/80 hover:bg-[#165A8C]/60 border border-[#165A8C]/60 text-xs text-left transition group"
            >
              <div className="font-bold text-purple-400 group-hover:text-purple-300">
                1. Admin Master Global
              </div>
              <div className="text-[10px] text-slate-300 font-mono truncate">master@pizzahub.com.br</div>
              <div className="text-[10px] text-[#A3B8CC]">Senha: masterpassword123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("gerente@pizzahub.com.br", "adminpassword123")}
              className="p-2 rounded-lg bg-[#092B4C]/80 hover:bg-[#165A8C]/60 border border-[#165A8C]/60 text-xs text-left transition group"
            >
              <div className="font-bold text-[#F26522] group-hover:text-orange-300">
                2. Gerente Limoeiro (Admin)
              </div>
              <div className="text-[10px] text-slate-300 font-mono truncate">gerente@pizzahub.com.br</div>
              <div className="text-[10px] text-[#A3B8CC]">Senha: adminpassword123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("cozinha@pizzahub.com.br", "staffpassword123")}
              className="p-2 rounded-lg bg-[#092B4C]/80 hover:bg-[#165A8C]/60 border border-[#165A8C]/60 text-xs text-left transition group"
            >
              <div className="font-bold text-amber-400 group-hover:text-amber-300">
                3. Cozinha / KDS (Staff)
              </div>
              <div className="text-[10px] text-slate-300 font-mono truncate">cozinha@pizzahub.com.br</div>
              <div className="text-[10px] text-[#A3B8CC]">Senha: staffpassword123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("lucas.cliente@gmail.com", "clientepassword123")}
              className="p-2 rounded-lg bg-[#092B4C]/80 hover:bg-[#165A8C]/60 border border-[#165A8C]/60 text-xs text-left transition group"
            >
              <div className="font-bold text-sky-400 group-hover:text-sky-300">
                4. Cliente Consumidor
              </div>
              <div className="text-[10px] text-slate-300 font-mono truncate">lucas.cliente@gmail.com</div>
              <div className="text-[10px] text-[#A3B8CC]">Senha: clientepassword123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
