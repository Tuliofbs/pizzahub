"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { TenantInfo } from "@/types";
import {
  Building2,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  ExternalLink,
  MapPin,
  Lock,
  Layers,
  Store,
  CheckCircle,
  Eye,
} from "lucide-react";

export function MasterView() {
  const { setActiveTenant, activeTenant, setCurrentView, user } = useApp();
  const [tenantsList, setTenantsList] = useState<TenantInfo[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal para Criar Nova Empresa / Unidade (Somente Master)
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("Limoeiro do Norte");
  const [phone, setPhone] = useState("(88) 99877-6655");
  const [address, setAddress] = useState("Av. Principal, 500");
  const [pixKey, setPixKey] = useState("48.201.890/0001-32");
  const [pixReceiver, setPixReceiver] = useState("");
  const [creating, setCreating] = useState(false);

  const isMaster = user?.role === "master";

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, aRes] = await Promise.all([
        fetch("/api/tenants"),
        fetch("/api/analytics"),
      ]);
      const tData = await tRes.json();
      const aData = await aRes.json();

      if (tData.success) setTenantsList(tData.tenants || []);
      if (aData.success) setAnalytics(aData.metrics || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTenant = async () => {
    if (!name || !slug) return;
    setCreating(true);
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          city,
          phone,
          address,
          pixKey,
          pixReceiverName: pixReceiver || name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setName("");
        setSlug("");
        loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  // Trava de segurança: Se não for master, bloqueia a tela inteira
  if (!isMaster) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-[#031B33] border border-purple-500/50 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center mx-auto text-purple-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Acesso Exclusivo: Administrador Master Global</h2>
        <p className="text-xs text-[#A3B8CC] leading-relaxed">
          Você está conectado como <strong className="text-white">{user?.name}</strong> com o papel de <strong>{user?.role?.toUpperCase()}</strong>.
          O painel de controle de todas as franquias da rede é de acesso exclusivo do <strong>Master Global</strong>.
        </p>
        <p className="text-[11px] text-purple-300 bg-purple-950/60 p-2.5 rounded-xl border border-purple-800">
          👑 <strong>Hierarquia do Sistema:</strong> Somente o Master pode criar empresas e enxergar dados unificados de todas as pizzarias.
        </p>
        <button
          onClick={() => setCurrentView("menu")}
          className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#F26522]/90 text-white font-bold text-xs shadow"
        >
          Voltar para a Área Permitida
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Master */}
      <div className="bg-gradient-to-r from-purple-950 via-[#031B33] to-[#092B4C] border border-purple-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Nível Supremo: Master Global — Acesso a Tudo de Todos</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Painel Central de Todas as Pizzarias
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#A3B8CC] leading-relaxed">
            Aqui você tem visão unificada de todas as unidades, controla os espaços individuais de cada pizzaria,
            cria novas unidades franqueadas e pode inspecionar ou assumir a gestão de qualquer loja da rede.
          </p>
        </div>
      </div>

      {/* Indicadores Globais Unificados da Rede Inteira */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#031B33] border border-purple-500/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#A3B8CC]">
            <span className="text-xs font-bold uppercase">Lojas / Franquias</span>
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {tenantsList.length}
          </div>
          <p className="mt-1 text-[11px] text-[#A3B8CC]">Pizzarias com espaços isolados</p>
        </div>

        <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#A3B8CC]">
            <span className="text-xs font-bold uppercase">Faturamento Geral Rede</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            R$ {analytics?.totalRevenue ? parseFloat(analytics.totalRevenue).toFixed(2).replace(".", ",") : "0,00"}
          </div>
          <p className="mt-1 text-[11px] text-[#A3B8CC]">Soma de todas as pizzarias</p>
        </div>

        <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#A3B8CC]">
            <span className="text-xs font-bold uppercase">Total de Pedidos</span>
            <TrendingUp className="w-5 h-5 text-[#F26522]" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {analytics?.totalOrders || 0}
          </div>
          <p className="mt-1 text-[11px] text-[#A3B8CC]">Em todo o ecossistema</p>
        </div>

        <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-[#A3B8CC]">
            <span className="text-xs font-bold uppercase">Usuários Cadastrados</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {analytics?.usersCount || 0}
          </div>
          <p className="mt-1 text-[11px] text-[#A3B8CC]">Clientes, gerentes e staff</p>
        </div>
      </div>

      {/* Lista de Espaços / Landing Pages de Cada Pizzaria */}
      <div className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 bg-[#092B4C]/60 border-b border-[#165A8C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Espaços Independentes por Pizzaria</h2>
            <p className="text-xs text-[#A3B8CC]">
              Cada pizzaria possui seu próprio cardápio, pedidos, Pix e funcionários. Como Master, você pode acessar e gerenciar qualquer uma:
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/30 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Unidade</span>
          </button>
        </div>

        <div className="divide-y divide-[#165A8C]/30">
          {tenantsList.map((tenant) => {
            const isSelected = activeTenant?.id === tenant.id;

            return (
              <div
                key={tenant.id}
                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                  isSelected ? "bg-[#165A8C]/20 border-l-4 border-l-[#F26522]" : "hover:bg-[#165A8C]/10"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{tenant.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                      slug: /{tenant.slug}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#F26522] text-white font-black px-2 py-0.5 rounded-full uppercase">
                        Espaço Ativo no Momento
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#A3B8CC] mt-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F26522]" />
                    <span>{tenant.address} — {tenant.city}, {tenant.state}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Chave Pix ({tenant.pixKeyType}): <span className="font-mono text-emerald-400">{tenant.pixKey}</span> • Tel WhatsApp: {tenant.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTenant(tenant);
                      setCurrentView("menu");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#165A8C] hover:bg-[#165A8C]/80 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    title="Ver a Landing Page / Cardápio desta loja"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F26522]" />
                    <span>Ver Espaço / Loja</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTenant(tenant);
                      setCurrentView("admin");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#092B4C] hover:bg-[#092B4C]/80 border border-[#165A8C]/60 text-white text-xs font-bold transition flex items-center gap-1.5"
                    title="Entrar na Gestão desta loja"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#F26522]" />
                    <span>Gerenciar Loja</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL PARA CRIAÇÃO DE NOVA EMPRESA / UNIDADE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#031B33] border border-purple-500/50 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="border-b border-[#165A8C]/40 pb-3">
              <span className="text-xs font-bold text-purple-400 uppercase">
                Ação Privilegiada Master
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Cadastrar Novo Espaço de Pizzaria (Tenant)
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                  Nome da Pizzaria / Unidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: PizzaHub - Aracati Litoral"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Slug URL (Espaço Único)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Cidade / Polo</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Telefone WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Chave Pix Própria</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Endereço da Unidade</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#165A8C]/40 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-[#165A8C]/30 text-[#A3B8CC] text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTenant}
                disabled={creating}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow"
              >
                {creating ? "Criando Espaço..." : "Salvar e Ativar Pizzaria"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
