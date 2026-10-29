"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { ProductItem, ProductAddonItem, TenantInfo } from "@/types";
import {
  Flame,
  Plus,
  Heart,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MapPin,
  Tag,
  Pizza,
  Utensils,
  Coffee,
  Check,
  ShoppingBag,
  Store,
  Layers,
  ChefHat,
  Lock,
  Palette,
} from "lucide-react";

interface MenuViewProps {
  searchTerm: string;
}

export function MenuView({ searchTerm }: MenuViewProps) {
  const { activeTenant, setActiveTenant, addToCart, setCurrentView, user } = useApp();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [addons, setAddons] = useState<ProductAddonItem[]>([]);
  const [allTenants, setAllTenants] = useState<TenantInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Personalização / Montagem do Item
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedSecondFlavor, setSelectedSecondFlavor] = useState<string>("");
  const [selectedBorders, setSelectedBorders] = useState<{ name: string; price: number }[]>([]);
  const [itemNotes, setItemNotes] = useState<string>("");

  const isMaster = user?.role === "master";

  // Paleta dinâmica configurada pela empresa
  const tenantPrimaryColor = activeTenant?.primaryColor || "#031B33";
  const tenantAccentColor = activeTenant?.accentColor || "#F26522";

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const tenantId = activeTenant?.id || "tenant-limoeiro-01";
        const [menuRes, tenantsRes] = await Promise.all([
          fetch(`/api/menu?tenantId=${tenantId}`),
          fetch(`/api/tenants`),
        ]);
        const menuData = await menuRes.json();
        const tenantsData = await tenantsRes.json();

        if (menuData.success) {
          setCategories(menuData.categories || []);
          setProducts(menuData.products || []);
          setAddons(menuData.addons || []);
        }
        if (tenantsData.success) {
          setAllTenants(tenantsData.tenants || []);
        }
      } catch (e) {
        console.error("Erro carregando cardápio:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeTenant]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const openCustomizeModal = (prod: ProductItem) => {
    setActiveModalProduct(prod);
    setSelectedSize(prod.sizesAvailable?.[0] || "Padrão");
    setSelectedSecondFlavor("");
    setSelectedBorders([]);
    setItemNotes("");
  };

  const handleAddCustomizedToCart = () => {
    if (!activeModalProduct) return;

    const basePrice = parseFloat(activeModalProduct.promotionalPrice || activeModalProduct.price);
    const borderTotal = selectedBorders.reduce((sum, b) => sum + b.price, 0);

    addToCart({
      cartItemId: `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: activeModalProduct.id,
      name: activeModalProduct.name,
      unitPrice: basePrice + borderTotal,
      quantity: 1,
      size: selectedSize,
      secondFlavor: selectedSecondFlavor || undefined,
      selectedAddons: selectedBorders,
      notes: itemNotes || undefined,
      imageUrl: activeModalProduct.imageUrl,
    });

    setActiveModalProduct(null);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === "all" || prod.categoryId === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const popularProducts = products.slice(0, 4);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "burgers":
        return "🍔";
      case "pizzas":
        return "🍕";
      case "pasta":
        return "🍝";
      case "fries":
        return "🍟";
      case "drinks":
        return "🥤";
      case "desserts":
        return "🍰";
      default:
        return "🍽️";
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO BANNER DA LANDING PAGE DA EMPRESA (Personalizado com sua própria paleta de cores) */}
      <div
        className="relative overflow-hidden rounded-3xl border shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all"
        style={{
          backgroundColor: tenantPrimaryColor,
          borderColor: `${tenantAccentColor}80`,
        }}
      >
        <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20" style={{ backgroundColor: tenantAccentColor }}></div>
        <div className="absolute -right-10 -top-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20" style={{ backgroundColor: tenantAccentColor }}></div>

        <div className="relative z-10 max-w-xl text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-white/20 text-xs font-bold text-white shadow">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: tenantAccentColor }}></span>
            <span>Espaço da Empresa:</span>
            <strong className="text-white uppercase">{activeTenant?.name}</strong>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Delivered <span className="italic font-serif" style={{ color: tenantAccentColor }}>Fresh</span>
          </h1>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tenantAccentColor }}></span>
              Cardápio Exclusivo
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Chave Pix Própria
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              {activeTenant?.city}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Bem-vindo à página de delivery da empresa <strong>{activeTenant?.name}</strong> no aplicativo PizzaHub.
            Pague via Pix direto na conta bancária oficial desta empresa com conferência no WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("popular-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 rounded-2xl text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl active:scale-95 transition"
              style={{ backgroundColor: tenantAccentColor }}
            >
              <span>Peça Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300">
              <Clock className="w-4 h-4" style={{ color: tenantAccentColor }} />
              <span>{activeTenant?.openingHours || "18:00 às 23:30"}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300">
              <MapPin className="w-4 h-4" style={{ color: tenantAccentColor }} />
              <span>Taxa: R$ {activeTenant?.deliveryFee ? parseFloat(activeTenant.deliveryFee).toFixed(2).replace(".", ",") : "6,00"}</span>
            </div>

            {/* Acesso rápido para editar o espaço da empresa */}
            {(isMaster || user?.tenantId === activeTenant?.id) && (
              <button
                onClick={() => setCurrentView("admin")}
                className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
                title="Editar cores e cards desta empresa"
              >
                <Palette className="w-4 h-4 text-amber-300" />
                <span>Editar Empresa</span>
              </button>
            )}
          </div>
        </div>

        {/* Combo Destacado */}
        <div className="relative z-10 w-full md:w-auto flex justify-center">
          <div className="relative group">
            <div className="w-64 sm:w-80 h-56 sm:h-72 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80"
                alt="Combo Especial da Loja"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Destaque da Loja</span>
                  <span className="text-[11px] text-slate-300">{activeTenant?.name}</span>
                </div>
                <span className="font-black text-white text-sm px-2.5 py-1 rounded-xl shadow" style={{ backgroundColor: tenantAccentColor }}>
                  R$ 49,90
                </span>
              </div>
            </div>

            <div className="absolute -top-3 -right-3 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-black uppercase animate-bounce" style={{ backgroundColor: tenantAccentColor }}>
              Oferta
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORIAS DE CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span>Categorias do Cardápio</span>
          </h2>
          <span className="text-xs text-[#A3B8CC] font-semibold">
            {categories.length} sessões
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border shadow-lg ${
              selectedCategory === "all"
                ? "text-white ring-2 scale-105"
                : "bg-[#031B33] border-[#165A8C]/50 text-[#A3B8CC] hover:bg-[#092B4C]"
            }`}
            style={selectedCategory === "all" ? { backgroundColor: "#165A8C", borderColor: tenantAccentColor } : {}}
          >
            <div className="w-11 h-11 rounded-xl bg-[#092B4C] flex items-center justify-center text-xl shadow-inner border border-[#165A8C]/60">
              ✨
            </div>
            <span className="text-xs font-bold truncate max-w-full">Todos</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border shadow-lg ${
                  isSelected
                    ? "text-white ring-2 scale-105"
                    : "bg-[#031B33] border-[#165A8C]/50 text-[#A3B8CC] hover:bg-[#092B4C]"
                }`}
                style={isSelected ? { backgroundColor: "#165A8C", borderColor: tenantAccentColor } : {}}
              >
                <div className="w-11 h-11 rounded-xl bg-[#092B4C] flex items-center justify-center text-xl shadow-inner border border-[#165A8C]/60">
                  {getCategoryIcon(cat.slug)}
                </div>
                <span className="text-xs font-bold truncate max-w-full">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIS PEDIDOS / POPULARES (Cards Dinâmicos) */}
      <div id="popular-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Mais Pedidos em {activeTenant?.name}
            </h2>
          </div>
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-xs font-bold hover:underline flex items-center gap-1"
            style={{ color: tenantAccentColor }}
          >
            <span>Ver Todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularProducts.map((prod) => {
            const isFav = favorites.includes(prod.id);
            const price = parseFloat(prod.promotionalPrice || prod.price);

            return (
              <div
                key={prod.id}
                onClick={() => openCustomizeModal(prod)}
                className="group bg-[#031B33] border border-[#165A8C]/40 hover:border-white/40 rounded-2xl overflow-hidden p-3 flex flex-col justify-between shadow-xl transition-all cursor-pointer relative"
              >
                <button
                  onClick={(e) => toggleFavorite(prod.id, e)}
                  className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-400 transition"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? "fill-rose-500 text-rose-500" : "text-white"
                    }`}
                  />
                </button>

                <div className="relative h-32 sm:h-36 w-full rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                  <img
                    src={prod.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  {prod.promotionalPrice && (
                    <span className="absolute bottom-2 left-2 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow" style={{ backgroundColor: tenantAccentColor }}>
                      Oferta
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                    {prod.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-black text-white">
                        R$ {price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCustomizeModal(prod);
                      }}
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-md group-hover:scale-110 transition"
                      style={{ backgroundColor: tenantAccentColor }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BANNER DE OFERTA EXCLUSIVA DA EMPRESA */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${tenantAccentColor}DD, ${tenantAccentColor})`,
        }}
      >
        <div className="space-y-2 max-w-lg">
          <div className="inline-block bg-[#031B33] text-amber-300 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow">
            Promoção da Empresa {activeTenant?.name}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Desconto Exclusivo no Pagamento via Pix!
          </h3>
          <p className="text-xs sm:text-sm text-slate-100">
            Pague via Pix direto na conta bancária oficial de {activeTenant?.pixReceiverName} e agilize seu pedido em {activeTenant?.city}.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById("catalog-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-6 py-3.5 rounded-2xl bg-[#031B33] hover:bg-black/80 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl border border-white/20 shrink-0 active:scale-95 transition"
        >
          <span>Ver Todos os Cards</span>
          <ArrowRight className="w-4 h-4" style={{ color: tenantAccentColor }} />
        </button>
      </div>

      {/* 5. SELETOR DE OUTRAS EMPRESAS DA PLATAFORMA PIZZAHUB */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#F26522]" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              Empresas e Pizzarias na Plataforma PizzaHub
            </h2>
          </div>
          {isMaster && (
            <button
              onClick={() => setCurrentView("master")}
              className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Gerenciar Todas as Empresas (Master)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {allTenants.map((t) => {
            const isSelected = activeTenant?.id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setActiveTenant(t)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "ring-2 shadow-xl"
                    : "bg-[#031B33] border-[#165A8C]/40 hover:bg-[#092B4C]"
                }`}
                style={isSelected ? { backgroundColor: `${t.primaryColor || "#165A8C"}90`, borderColor: t.accentColor || "#F26522" } : {}}
              >
                <div>
                  <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-900 mb-2 relative">
                    <img
                      src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80"
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute top-2 left-2 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow" style={{ backgroundColor: t.accentColor || "#F26522" }}>
                        Ativa
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-xs text-white truncate">{t.name}</h3>
                  <p className="text-[10px] text-[#A3B8CC] mt-0.5 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">4.9</span>
                    <span>({t.city})</span>
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#A3B8CC]">
                  <span>Entrega: R$ {parseFloat(t.deliveryFee).toFixed(2).replace(".", ",")}</span>
                  <span className="font-bold text-white">Entrar →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. CATÁLOGO COMPLETO COM OS CARDS DA EMPRESA */}
      <div id="catalog-section" className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-white">
            Cardápio Completo de {activeTenant?.name} ({filteredProducts.length} itens)
          </h2>
          {(isMaster || user?.tenantId === activeTenant?.id) && (
            <button
              onClick={() => setCurrentView("admin")}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>+ Adicionar / Editar Cards</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#A3B8CC]">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: tenantAccentColor }}></div>
            <p>Carregando pratos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-[#A3B8CC] bg-[#031B33]/40 rounded-2xl border border-[#165A8C]/30">
            <p className="font-bold">Nenhum card cadastrado nesta empresa para esta busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => {
              const hasPromo = !!prod.promotionalPrice;
              const price = parseFloat(prod.promotionalPrice || prod.price);
              const isFav = favorites.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="group bg-[#031B33] border border-[#165A8C]/40 hover:border-white/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all"
                >
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />

                    {hasPromo && (
                      <span className="absolute top-3 left-3 text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase" style={{ backgroundColor: tenantAccentColor }}>
                        Oferta
                      </span>
                    )}

                    <button
                      onClick={(e) => toggleFavorite(prod.id, e)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-400 transition"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? "fill-rose-500 text-rose-500" : "text-white"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {prod.name}
                      </h3>
                      <p className="mt-1 text-xs text-[#A3B8CC] line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#165A8C]/30 flex items-center justify-between">
                      <div>
                        {hasPromo && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            R$ {parseFloat(prod.price).toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        <span className="text-base font-black text-white">
                          R$ {price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>

                      <button
                        onClick={() => openCustomizeModal(prod)}
                        className="px-3.5 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
                        style={{ backgroundColor: tenantAccentColor }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{prod.isPizza ? "Montar" : "Pedir"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE CUSTOMIZAÇÃO DO PRODUTO */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#031B33] border border-[#165A8C] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-[#165A8C]/40 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tenantAccentColor }}>
                  Personalizar Item ({activeTenant?.name})
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {activeModalProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-5">
              {activeModalProduct.sizesAvailable && activeModalProduct.sizesAvailable.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-[#A3B8CC] uppercase mb-2 block">
                    1. Escolha o Tamanho
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeModalProduct.sizesAvailable.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                          selectedSize === sz
                            ? "bg-[#165A8C] text-white ring-1"
                            : "bg-[#092B4C] border-[#165A8C]/40 text-[#A3B8CC] hover:bg-[#165A8C]/20"
                        }`}
                        style={selectedSize === sz ? { borderColor: tenantAccentColor } : {}}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModalProduct.isPizza && (
                <div>
                  <label className="text-xs font-bold text-[#A3B8CC] uppercase mb-2 block">
                    2. Segundo Sabor (Opcional - Meio a Meio)
                  </label>
                  <select
                    value={selectedSecondFlavor}
                    onChange={(e) => setSelectedSecondFlavor(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="">Pizza inteira ({activeModalProduct.name})</option>
                    {products
                      .filter((p) => p.isPizza && p.id !== activeModalProduct.id)
                      .map((p) => (
                        <option key={p.id} value={p.name}>
                          Meio a Meio com: {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {activeModalProduct.isPizza && addons.filter((a) => a.category === "border").length > 0 && (
                <div>
                  <label className="text-xs font-bold text-[#A3B8CC] uppercase mb-2 block">
                    3. Borda Recheada Artesanal (Opcional)
                  </label>
                  <div className="space-y-2">
                    {addons
                      .filter((a) => a.category === "border")
                      .map((addon) => {
                        const isChecked = selectedBorders.some((b) => b.name === addon.name);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedBorders([]);
                              } else {
                                setSelectedBorders([{ name: addon.name, price: parseFloat(addon.price) }]);
                              }
                            }}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                              isChecked
                                ? "bg-[#165A8C]/40 text-white"
                                : "bg-[#092B4C]/40 border-[#165A8C]/40 text-[#A3B8CC]"
                            }`}
                            style={isChecked ? { borderColor: tenantAccentColor } : {}}
                          >
                            <span className="font-semibold">{addon.name}</span>
                            <span className="font-bold" style={{ color: tenantAccentColor }}>
                              + R$ {parseFloat(addon.price).toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#A3B8CC] uppercase mb-1.5 block">
                  Observações para a Cozinha ({activeTenant?.name})
                </label>
                <input
                  type="text"
                  placeholder="Ex: sem cebola, ponto bem passado, cortar em 12 pedaços..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#165A8C]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#A3B8CC] uppercase block">Subtotal Item</span>
                <span className="text-xl font-black text-white">
                  R${" "}
                  {(
                    parseFloat(activeModalProduct.promotionalPrice || activeModalProduct.price) +
                    selectedBorders.reduce((acc, b) => acc + b.price, 0)
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#165A8C]/30 text-[#A3B8CC] hover:bg-[#165A8C]/60 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCustomizedToCart}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-lg active:scale-95 transition"
                  style={{ backgroundColor: tenantAccentColor }}
                >
                  Adicionar à Sacola
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
