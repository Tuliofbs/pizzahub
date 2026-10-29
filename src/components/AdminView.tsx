"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { OrderData, ProductItem } from "@/types";
import {
  DollarSign,
  TrendingUp,
  Clock,
  FileSpreadsheet,
  Plus,
  Store,
  QrCode,
  RefreshCw,
  Palette,
  Edit3,
  Trash2,
  Check,
  X,
  Lock,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  Save,
} from "lucide-react";

export function AdminView() {
  const { activeTenant, setActiveTenant, user, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<"visual_brand" | "catalog_cards" | "orders" | "pix_settings">("visual_brand");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificação estrita de autorização
  const isMaster = user?.role === "master";
  const isAuthorized = isMaster || (user?.role === "admin" && user?.tenantId === activeTenant?.id);

  // Estados de Edição da Identidade & Cores da Empresa (Tenant)
  const [companyName, setCompanyName] = useState(activeTenant?.name || "");
  const [companySlug, setCompanySlug] = useState(activeTenant?.slug || "");
  const [companyPhone, setCompanyPhone] = useState(activeTenant?.phone || "");
  const [companyCity, setCompanyCity] = useState(activeTenant?.city || "");
  const [companyAddress, setCompanyAddress] = useState(activeTenant?.address || "");
  const [primaryColor, setPrimaryColor] = useState(activeTenant?.primaryColor || "#031B33");
  const [accentColor, setAccentColor] = useState(activeTenant?.accentColor || "#F26522");
  const [openingHours, setOpeningHours] = useState(activeTenant?.openingHours || "18:00 às 23:30");
  const [deliveryFee, setDeliveryFee] = useState(activeTenant?.deliveryFee || "6.00");
  const [savingBrand, setSavingBrand] = useState(false);
  const [brandSuccessMsg, setBrandSuccessMsg] = useState("");

  // Modal de Adicionar / Editar Card de Produto
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("45.00");
  const [prodPromoPrice, setProdPromoPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodIsPizza, setProdIsPizza] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Configurações do Pix da Loja
  const [pixKey, setPixKey] = useState(activeTenant?.pixKey || "");
  const [pixKeyType, setPixKeyType] = useState(activeTenant?.pixKeyType || "CNPJ");
  const [pixReceiverName, setPixReceiverName] = useState(activeTenant?.pixReceiverName || "");
  const [pixBankName, setPixBankName] = useState(activeTenant?.pixBankName || "");
  const [whatsappNumber, setWhatsappNumber] = useState(activeTenant?.whatsappNumber || "");
  const [savingPix, setSavingPix] = useState(false);
  const [pixSuccessMsg, setPixSuccessMsg] = useState("");

  const loadData = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const tenantId = activeTenant?.id || "tenant-limoeiro-01";
      const [ordRes, menuRes] = await Promise.all([
        fetch(`/api/orders?tenantId=${tenantId}`),
        fetch(`/api/menu?tenantId=${tenantId}`),
      ]);
      const ordData = await ordRes.json();
      const menuData = await menuRes.json();

      if (ordData.success) setOrders(ordData.orders || []);
      if (menuData.success) setProducts(menuData.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenant) {
      setCompanyName(activeTenant.name);
      setCompanySlug(activeTenant.slug);
      setCompanyPhone(activeTenant.phone);
      setCompanyCity(activeTenant.city);
      setCompanyAddress(activeTenant.address);
      setPrimaryColor(activeTenant.primaryColor || "#031B33");
      setAccentColor(activeTenant.accentColor || "#F26522");
      setOpeningHours(activeTenant.openingHours);
      setDeliveryFee(activeTenant.deliveryFee);
      setPixKey(activeTenant.pixKey);
      setPixKeyType(activeTenant.pixKeyType);
      setPixReceiverName(activeTenant.pixReceiverName);
      setPixBankName(activeTenant.pixBankName);
      setWhatsappNumber(activeTenant.whatsappNumber);
    }
    loadData();
  }, [activeTenant, user]);

  // Salvar Identidade Visual da Loja
  const handleSaveBrand = async () => {
    if (!activeTenant) return;
    setSavingBrand(true);
    setBrandSuccessMsg("");
    try {
      const res = await fetch("/api/tenants/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeTenant.id,
          name: companyName,
          slug: companySlug,
          phone: companyPhone,
          city: companyCity,
          address: companyAddress,
          primaryColor,
          accentColor,
          openingHours,
          deliveryFee,
        }),
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setActiveTenant(data.tenant);
        setBrandSuccessMsg("Configurações visuais e paleta de cores salvas com sucesso!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingBrand(false);
    }
  };

  // Abrir modal de criação de Card
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdPrice("39.90");
    setProdPromoPrice("");
    setProdDesc("");
    setProdImageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80");
    setProdIsPizza(true);
    setShowProductModal(true);
  };

  // Abrir modal de edição de Card existente
  const openEditProductModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdPromoPrice(prod.promotionalPrice || "");
    setProdDesc(prod.description || "");
    setProdImageUrl(prod.imageUrl || "");
    setProdIsPizza(prod.isPizza);
    setShowProductModal(true);
  };

  // Salvar Produto (Novo ou Edição)
  const handleSaveProduct = async () => {
    if (!activeTenant || !prodName || !prodPrice) return;
    setSavingProduct(true);
    try {
      if (editingProduct) {
        // Atualizar Card
        const res = await fetch("/api/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
            name: prodName,
            price: prodPrice,
            promotionalPrice: prodPromoPrice ? prodPromoPrice : null,
            description: prodDesc,
            imageUrl: prodImageUrl,
            isPizza: prodIsPizza,
          }),
        });
        if ((await res.json()).success) {
          setShowProductModal(false);
          loadData();
        }
      } else {
        // Criar Card
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId: activeTenant.id,
            name: prodName,
            price: prodPrice,
            promotionalPrice: prodPromoPrice ? prodPromoPrice : null,
            description: prodDesc,
            imageUrl: prodImageUrl,
            isPizza: prodIsPizza,
          }),
        });
        if ((await res.json()).success) {
          setShowProductModal(false);
          loadData();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProduct(false);
    }
  };

  // Deletar Produto
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Deseja realmente excluir este card do cardápio?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if ((await res.json()).success) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Salvar Pix
  const handleSavePix = async () => {
    if (!activeTenant) return;
    setSavingPix(true);
    setPixSuccessMsg("");
    try {
      const res = await fetch("/api/tenants/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeTenant.id,
          pixKey,
          pixKeyType,
          pixReceiverName,
          pixBankName,
          whatsappNumber,
        }),
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setActiveTenant(data.tenant);
        setPixSuccessMsg("Dados bancários e WhatsApp da loja atualizados!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPix(false);
    }
  };

  // Verificação de Acesso Restrito
  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-[#031B33] border border-rose-500/50 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Acesso Restrito: Espaço da Empresa</h2>
        <p className="text-xs text-[#A3B8CC] leading-relaxed">
          Você está conectado como <strong className="text-white">{user?.name}</strong>, 
          mas não possui permissão de edição para a empresa <strong>{activeTenant?.name}</strong>.
        </p>
        <p className="text-[11px] text-amber-400 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800">
          🔒 <strong>Regra de Isolamento:</strong> Somente o <strong>Master Global</strong> do aplicativo PizzaHub ou o Gerente da própria empresa podem editar estas informações.
        </p>
        <button
          onClick={() => setCurrentView("menu")}
          className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#F26522]/90 text-white font-bold text-xs shadow"
        >
          Voltar para o Cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner de Identificação da Empresa */}
      <div
        className="rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: activeTenant?.primaryColor || "#031B33",
          borderColor: activeTenant?.accentColor || "#165A8C",
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white uppercase tracking-wider" style={{ backgroundColor: activeTenant?.accentColor || "#F26522" }}>
              Painel de Gestão da Empresa
            </span>
            <span className="text-xs text-slate-300 font-mono">
              App PizzaHub • Slug: /{activeTenant?.slug}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {activeTenant?.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: activeTenant?.accentColor || "#F26522" }} />
            <span>{activeTenant?.address} — {activeTenant?.city}, {activeTenant?.state}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-300 uppercase block font-bold">Paleta Ativa</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: activeTenant?.primaryColor || "#031B33" }} title="Cor Principal"></span>
              <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: activeTenant?.accentColor || "#F26522" }} title="Cor de Destaque"></span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView("menu")}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-black shadow-lg transition active:scale-95"
            style={{ backgroundColor: activeTenant?.accentColor || "#F26522" }}
          >
            Ver Landing Page ao Vivo
          </button>
        </div>
      </div>

      {/* Tabs de Configuração e Gestão */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#165A8C]/40 pb-3">
        <button
          onClick={() => setActiveTab("visual_brand")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "visual_brand"
              ? "bg-[#165A8C] text-white shadow"
              : "text-[#A3B8CC] hover:bg-[#165A8C]/30"
          }`}
        >
          <Palette className="w-4 h-4 text-[#F26522]" />
          <span>Personalizar Empresa & Cores</span>
        </button>

        <button
          onClick={() => setActiveTab("catalog_cards")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "catalog_cards"
              ? "bg-[#165A8C] text-white shadow"
              : "text-[#A3B8CC] hover:bg-[#165A8C]/30"
          }`}
        >
          <Store className="w-4 h-4 text-[#F26522]" />
          <span>Alteração dos Cards ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-[#165A8C] text-white shadow"
              : "text-[#A3B8CC] hover:bg-[#165A8C]/30"
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Auditoria de Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("pix_settings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "pix_settings"
              ? "bg-[#165A8C] text-white shadow"
              : "text-[#A3B8CC] hover:bg-[#165A8C]/30"
          }`}
        >
          <QrCode className="w-4 h-4 text-amber-400" />
          <span>Configuração Pix da Loja</span>
        </button>
      </div>

      {/* TAB 1: PÁGINA EDITÁVEL — PALETA DE CORES E DADOS DA EMPRESA */}
      {activeTab === "visual_brand" && (
        <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-[#165A8C]/40 pb-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#F26522]" />
              <span>Personalização Visual da Empresa</span>
            </h2>
            <p className="text-xs text-[#A3B8CC] mt-1">
              Altere o nome da sua empresa, slogan, cidade e controle a <strong>paleta de cores</strong> refletida na sua landing page.
            </p>
          </div>

          {brandSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{brandSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações da Empresa */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-[#A3B8CC] tracking-wider">
                1. Informações Básicas
              </h3>

              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                  Nome Oficial da Empresa (Pizzaria)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    value={companySlug}
                    onChange={(e) => setCompanySlug(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                    WhatsApp da Empresa
                  </label>
                  <input
                    type="text"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                    Cidade / Região
                  </label>
                  <input
                    type="text"
                    value={companyCity}
                    onChange={(e) => setCompanyCity(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                    Taxa Fixa de Entrega (R$)
                  </label>
                  <input
                    type="text"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                  Endereço Físico
                </label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Configuração da Paleta de Cores da Empresa */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-[#A3B8CC] tracking-wider">
                2. Paleta de Cores do Sistema da Loja
              </h3>

              <div className="p-4 bg-[#092B4C]/60 border border-[#165A8C]/50 rounded-2xl space-y-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    Cor Principal de Fundo (HEX)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 rounded-xl bg-transparent border border-[#165A8C] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-[#031B33] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Define o tom de fundo e caixas de destaque da landing page da sua empresa.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1.5">
                    Cor de Destaque / Botões (HEX)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 rounded-xl bg-transparent border border-[#165A8C] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 bg-[#031B33] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Define os botões de adicionar, botões de ação e emblemas de promoção.
                  </span>
                </div>

                {/* Prévia Instantânea do Card */}
                <div className="mt-3 p-3.5 rounded-2xl border" style={{ backgroundColor: primaryColor, borderColor: accentColor }}>
                  <span className="text-[10px] uppercase font-bold text-slate-300 block mb-1">
                    Prévia do Card da Empresa:
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{companyName || "Nome da Sua Loja"}</h4>
                      <p className="text-[11px] text-slate-300">Pizzas artesanais no forno a lenha</p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl text-white font-bold text-xs"
                      style={{ backgroundColor: accentColor }}
                    >
                      Pedir Agora
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão Salvar Paleta */}
              <button
                onClick={handleSaveBrand}
                disabled={savingBrand}
                className="w-full py-3.5 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl active:scale-95 transition"
                style={{ backgroundColor: accentColor || "#F26522" }}
              >
                <Save className="w-4 h-4" />
                <span>{savingBrand ? "Salvando Alterações..." : "Salvar Configurações Visuais da Loja"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALTERAÇÃO DOS CARDS DE PRODUTOS */}
      {activeTab === "catalog_cards" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#031B33] border border-[#165A8C]/40 p-5 rounded-2xl">
            <div>
              <h2 className="text-base font-bold text-white">Cards de Produtos de {activeTenant?.name}</h2>
              <p className="text-xs text-[#A3B8CC]">
                Crie novos pratos, altere fotos, descrições, preços e promoções que aparecem na landing page.
              </p>
            </div>

            <button
              onClick={openCreateProductModal}
              className="px-4 py-2.5 rounded-xl text-white text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition"
              style={{ backgroundColor: activeTenant?.accentColor || "#F26522" }}
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Card de Produto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#165A8C] transition"
              >
                <div className="relative h-44 w-full bg-slate-900">
                  <img
                    src={prod.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  {prod.promotionalPrice && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Promoção Ativa
                    </span>
                  )}
                  {prod.isPizza && (
                    <span className="absolute top-2 right-2 bg-[#031B33]/80 text-[#A3B8CC] text-[10px] font-bold px-2 py-0.5 rounded border border-[#165A8C]">
                      Pizza (Meio a Meio)
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{prod.name}</h3>
                    <p className="text-xs text-[#A3B8CC] mt-1 line-clamp-2">{prod.description}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-black text-white">
                        R$ {parseFloat(prod.promotionalPrice || prod.price).toFixed(2).replace(".", ",")}
                      </span>
                      {prod.promotionalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          R$ {parseFloat(prod.price).toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#165A8C]/30 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditProductModal(prod)}
                      className="flex-1 py-2 rounded-xl bg-[#165A8C]/50 hover:bg-[#165A8C] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Card</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                      title="Excluir Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL DE CRIAÇÃO / EDIÇÃO DO CARD */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#031B33] border border-[#165A8C] rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#165A8C]/40 pb-3">
                  <h3 className="text-base font-black text-white">
                    {editingProduct ? "Editar Card de Produto" : "Criar Novo Card no Cardápio"}
                  </h3>
                  <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white font-bold">
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Título do Prato / Card</label>
                    <input
                      type="text"
                      placeholder="Ex: Pizza Quatro Queijos Nobre"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Preço Normal (R$)</label>
                      <input
                        type="text"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Preço Promocional (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: 39.90"
                        value={prodPromoPrice}
                        onChange={(e) => setProdPromoPrice(e.target.value)}
                        className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">URL da Imagem do Card</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Descrição / Ingredientes</label>
                    <textarea
                      rows={3}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isPizzaCheck"
                      checked={prodIsPizza}
                      onChange={(e) => setProdIsPizza(e.target.checked)}
                      className="w-4 h-4 accent-[#F26522] rounded"
                    />
                    <label htmlFor="isPizzaCheck" className="text-xs text-[#A3B8CC] font-bold cursor-pointer">
                      Este item é Pizza (permite seleção meio a meio e borda recheada)
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#165A8C]/40 flex justify-end gap-2">
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#165A8C]/30 text-[#A3B8CC] text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={savingProduct}
                    className="px-5 py-2 rounded-xl text-white text-xs font-black shadow"
                    style={{ backgroundColor: activeTenant?.accentColor || "#F26522" }}
                  >
                    {savingProduct ? "Salvando Card..." : "Salvar Card"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDITORIA DE PEDIDOS */}
      {activeTab === "orders" && (
        <div className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#092B4C]/60 border-b border-[#165A8C]/40 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Livro de Vendas da Empresa {activeTenant?.name}</h2>
            <button onClick={loadData} className="p-1.5 text-[#A3B8CC] hover:text-white rounded bg-[#165A8C]/30">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A3B8CC]">
              <thead className="bg-[#092B4C] text-[11px] uppercase font-bold text-slate-300 border-b border-[#165A8C]/40">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Modalidade</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status Pix</th>
                  <th className="p-3">Cozinha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#165A8C]/30">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#165A8C]/20 transition">
                    <td className="p-3 font-mono font-bold text-white">{ord.code}</td>
                    <td className="p-3 font-bold text-white">{ord.customerName}</td>
                    <td className="p-3 uppercase text-[10px] font-bold">{ord.deliveryType}</td>
                    <td className="p-3 font-black text-white">R$ {parseFloat(ord.totalAmount).toFixed(2).replace(".", ",")}</td>
                    <td className="p-3 font-bold text-emerald-400">{ord.paymentStatus}</td>
                    <td className="p-3">{ord.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURAÇÃO DO PIX */}
      {activeTab === "pix_settings" && (
        <div className="max-w-2xl bg-[#031B33] border border-[#165A8C]/50 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#165A8C]/40 pb-3">
            <QrCode className="w-5 h-5 text-[#F26522]" />
            <div>
              <h2 className="text-sm font-black text-white">Chave Pix Própria de {activeTenant?.name}</h2>
              <p className="text-xs text-[#A3B8CC]">O cliente transfere diretamente para a conta da sua empresa.</p>
            </div>
          </div>

          {pixSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-semibold">
              {pixSuccessMsg}
            </div>
          )}

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Tipo de Chave</label>
                <select
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="CNPJ">CNPJ</option>
                  <option value="CPF">CPF</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="PHONE">Telefone</option>
                  <option value="CHAVE_ALEATORIA">Chave Aleatória</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Chave Pix</label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Titular da Conta</label>
              <input
                type="text"
                value={pixReceiverName}
                onChange={(e) => setPixReceiverName(e.target.value)}
                className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">Banco</label>
                <input
                  type="text"
                  value={pixBankName}
                  onChange={(e) => setPixBankName(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#A3B8CC] block mb-1">WhatsApp para Comprovantes</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSavePix}
              disabled={savingPix}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow"
              style={{ backgroundColor: activeTenant?.accentColor || "#F26522" }}
            >
              {savingPix ? "Gravando..." : "Salvar Configurações Pix"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
