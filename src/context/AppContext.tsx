"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession, TenantInfo } from "@/types";

interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  size?: string;
  secondFlavor?: string;
  selectedAddons?: { name: string; price: number }[];
  notes?: string;
  imageUrl?: string | null;
}

interface AppContextType {
  user: UserSession | null;
  activeTenant: TenantInfo | null;
  presentationMode: boolean;
  cart: CartItem[];
  currentView: "menu" | "cart" | "order_success" | "kds" | "admin" | "master" | "docs";
  lastCreatedOrderId: string | null;
  setPresentationMode: (active: boolean) => void;
  setUser: (u: UserSession | null) => void;
  setActiveTenant: (t: TenantInfo | null) => void;
  setCurrentView: (view: any) => void;
  setLastCreatedOrderId: (id: string | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  switchPersona: (role: "master" | "admin" | "staff" | "customer", targetTenantId?: string) => Promise<void>;
  resetDemoData: () => void;
  selectTenantBySlug: (slug: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Usuário padrão inicial: Admin Master (para poder testar todas as áreas e unidades)
  const [user, setUser] = useState<UserSession | null>({
    id: "user-master-01",
    name: "Carlos Master Hub",
    email: "master@pizzahub.com.br",
    role: "master",
    tenantId: null,
    phone: "(88) 99999-0001",
  });

  const [activeTenant, setActiveTenant] = useState<TenantInfo | null>({
    id: "tenant-limoeiro-01",
    name: "PizzaHub - Limoeiro Centro",
    slug: "limoeiro-centro",
    phone: "(88) 99844-3321",
    city: "Limoeiro do Norte",
    state: "CE",
    address: "Rua Coronel Malveira, 1420 - Centro",
    active: true,
    primaryColor: "#031B33",
    accentColor: "#F26522",
    logoUrl: "/logo-icon.svg",
    pixKeyType: "CNPJ",
    pixKey: "48.201.890/0001-32",
    pixReceiverName: "PizzaHub Limoeiro Gastronomia Ltda",
    pixBankName: "Banco do Brasil (Ag: 0628)",
    whatsappNumber: "5588998443321",
    deliveryFee: "6.00",
    minOrderAmount: "25.00",
    openingHours: "Terça a Domingo - 18h às 23h30",
  });

  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppContextType["currentView"]>("menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState<string | null>(null);

  // Inicializar dados do seed no primeiro carregamento
  useEffect(() => {
    fetch("/api/seed")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.tenants?.[0] && !activeTenant) {
          setActiveTenant(data.data.tenants[0]);
        }
      })
      .catch((err) => console.error("Auto-seed error:", err));
  }, []);

  const selectTenantBySlug = async (slug: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tenants/${slug}`);
      const data = await res.json();
      if (data.success && data.tenant) {
        setActiveTenant(data.tenant);
        clearCart();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.secondFlavor === item.secondFlavor &&
          JSON.stringify(i.selectedAddons) === JSON.stringify(item.selectedAddons)
      );
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === existing.cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const switchPersona = async (role: "master" | "admin" | "staff" | "customer", targetTenantId?: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch_persona", role }),
      });
      const data = await res.json();
      if (data.success) {
        const loggedUser = data.user;
        if (targetTenantId) {
          loggedUser.tenantId = targetTenantId;
        }
        setUser(loggedUser);

        // Se o usuário tem tenantId fixo (não é master global), força a tela ativa a ser a de sua loja
        if (loggedUser.role !== "master" && loggedUser.tenantId) {
          const tRes = await fetch("/api/tenants");
          const tData = await tRes.json();
          if (tData.success && tData.tenants) {
            const myTenant = tData.tenants.find((t: TenantInfo) => t.id === loggedUser.tenantId);
            if (myTenant) setActiveTenant(myTenant);
          }
        }

        // Direcionar para a respectiva tela
        if (role === "master") setCurrentView("master");
        else if (role === "admin") setCurrentView("admin");
        else if (role === "staff") setCurrentView("kds");
        else setCurrentView("menu");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetDemoData = () => {
    fetch("/api/seed")
      .then(() => {
        alert("Demonstração e lojas reiniciadas com dados padrão!");
        window.location.reload();
      });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTenant,
        presentationMode,
        cart,
        currentView,
        lastCreatedOrderId,
        setPresentationMode,
        setUser,
        setActiveTenant,
        setCurrentView,
        setLastCreatedOrderId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        switchPersona,
        resetDemoData,
        selectTenantBySlug,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de AppProvider");
  }
  return context;
}
