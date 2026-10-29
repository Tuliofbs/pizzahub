"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  QrCode,
  MapPin,
  Clock,
  ChevronLeft,
} from "lucide-react";

export function CartView() {
  const { cart, activeTenant, user, updateQuantity, removeFromCart, clearCart, setCurrentView, setLastCreatedOrderId } = useApp();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup" | "dine_in">("delivery");
  const [customerName, setCustomerName] = useState(user?.name || "Lucas Silva Ferreira");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "(88) 98122-3344");
  const [addressStreet, setAddressStreet] = useState("Rua Sindulfo Chaves");
  const [addressNumber, setAddressNumber] = useState("340");
  const [addressNeighborhood, setAddressNeighborhood] = useState("Centro");
  const [addressComplement, setAddressComplement] = useState("Apto 102");
  const [tableNumber, setTableNumber] = useState("04");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryType === "delivery" ? parseFloat(activeTenant?.deliveryFee || "6.00") : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    setErrorMessage("");
    if (cart.length === 0) {
      setErrorMessage("Seu carrinho está vazio!");
      return;
    }
    if (!customerName || !customerPhone) {
      setErrorMessage("Por favor, preencha seu nome e WhatsApp.");
      return;
    }
    if (deliveryType === "delivery" && (!addressStreet || !addressNumber)) {
      setErrorMessage("Por favor, informe seu endereço para entrega em Limoeiro.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        tenantId: activeTenant?.id || "tenant-limoeiro-01",
        customerId: user?.id || null,
        customerName,
        customerPhone,
        deliveryType,
        addressStreet: deliveryType === "delivery" ? addressStreet : null,
        addressNumber: deliveryType === "delivery" ? addressNumber : null,
        addressNeighborhood: deliveryType === "delivery" ? addressNeighborhood : null,
        addressCity: activeTenant?.city || "Limoeiro do Norte",
        addressComplement: deliveryType === "delivery" ? addressComplement : null,
        tableNumber: deliveryType === "dine_in" ? tableNumber : null,
        items: cart.map((i) => ({
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice.toFixed(2),
          size: i.size,
          secondFlavor: i.secondFlavor,
          selectedAddons: i.selectedAddons,
          notes: i.notes,
        })),
        notes: orderNotes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setLastCreatedOrderId(data.order.id);
        clearCart();
        setCurrentView("order_success");
      } else {
        setErrorMessage(data.error || "Ocorreu um erro ao registrar seu pedido.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão com o servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-[#031B33] border border-[#165A8C]/40 rounded-3xl p-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-[#165A8C]/30 flex items-center justify-center mx-auto mb-4 text-[#F26522]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Seu carrinho está vazio</h2>
        <p className="text-xs text-[#A3B8CC] mt-2 mb-6">
          Explore nosso cardápio de pizzas artesanais no forno a lenha, calzones e bebidas geladas.
        </p>
        <button
          onClick={() => setCurrentView("menu")}
          className="px-6 py-3 rounded-xl bg-[#F26522] hover:bg-[#F26522]/90 text-white font-bold text-xs shadow-lg shadow-[#F26522]/30 transition"
        >
          Explorar Cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#165A8C]/40 pb-4">
        <button
          onClick={() => setCurrentView("menu")}
          className="text-xs text-[#A3B8CC] hover:text-white flex items-center gap-1 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Continuar Comprando
        </button>
        <h1 className="text-xl font-black text-white">Meu Carrinho & Finalização</h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
        >
          Esvaziar
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista de Itens do Carrinho */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xs font-bold text-[#A3B8CC] uppercase tracking-wider">
            Itens Selecionados ({cart.length})
          </h2>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl p-4 flex gap-4 items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-white">{item.name}</h3>
                  {item.size && (
                    <span className="text-[11px] text-[#F26522] font-semibold block">
                      Tamanho: {item.size}
                    </span>
                  )}
                  {item.secondFlavor && (
                    <span className="text-[11px] text-amber-400 block">
                      1/2 {item.secondFlavor}
                    </span>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <span className="text-[10px] text-[#A3B8CC] block">
                      Borda: {item.selectedAddons.map((a) => a.name).join(", ")}
                    </span>
                  )}
                  {item.notes && (
                    <span className="text-[10px] text-slate-400 italic block">
                      Obs: {item.notes}
                    </span>
                  )}
                  <span className="text-xs font-black text-white mt-1 block">
                    R$ {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#092B4C] border border-[#165A8C] rounded-lg p-1 text-xs">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="p-1 hover:text-[#F26522] transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="p-1 hover:text-[#F26522] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-rose-400 hover:text-rose-300 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário de Entrega e Fechamento */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-[#A3B8CC] uppercase tracking-wider">
              Forma de Recebimento
            </h2>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType("delivery")}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                  deliveryType === "delivery"
                    ? "bg-[#165A8C] border-[#F26522] text-white"
                    : "bg-[#092B4C] border-[#165A8C]/40 text-[#A3B8CC]"
                }`}
              >
                Entrega
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType("pickup")}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                  deliveryType === "pickup"
                    ? "bg-[#165A8C] border-[#F26522] text-white"
                    : "bg-[#092B4C] border-[#165A8C]/40 text-[#A3B8CC]"
                }`}
              >
                Retirada
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType("dine_in")}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                  deliveryType === "dine_in"
                    ? "bg-[#165A8C] border-[#F26522] text-white"
                    : "bg-[#092B4C] border-[#165A8C]/40 text-[#A3B8CC]"
                }`}
              >
                Na Mesa
              </button>
            </div>

            {/* Dados do Cliente */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-[#A3B8CC] font-bold block mb-1">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#A3B8CC] font-bold block mb-1">
                  WhatsApp para Confirmação do Pix
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F26522]"
                />
              </div>

              {/* Endereço de Entrega */}
              {deliveryType === "delivery" && (
                <div className="space-y-2 pt-2 border-t border-[#165A8C]/30">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] text-[#A3B8CC] block">Rua / Logradouro</label>
                      <input
                        type="text"
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        className="w-full bg-[#092B4C] border border-[#165A8C] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#A3B8CC] block">Número</label>
                      <input
                        type="text"
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                        className="w-full bg-[#092B4C] border border-[#165A8C] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#A3B8CC] block">Bairro</label>
                      <input
                        type="text"
                        value={addressNeighborhood}
                        onChange={(e) => setAddressNeighborhood(e.target.value)}
                        className="w-full bg-[#092B4C] border border-[#165A8C] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#A3B8CC] block">Complemento</label>
                      <input
                        type="text"
                        value={addressComplement}
                        onChange={(e) => setAddressComplement(e.target.value)}
                        className="w-full bg-[#092B4C] border border-[#165A8C] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {deliveryType === "dine_in" && (
                <div>
                  <label className="text-[11px] text-[#A3B8CC] font-bold block mb-1">
                    Número da Mesa
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Resumo de Valores */}
            <div className="border-t border-[#165A8C]/40 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#A3B8CC]">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              {deliveryType === "delivery" && (
                <div className="flex justify-between text-[#A3B8CC]">
                  <span>Taxa de Entrega</span>
                  <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#165A8C]/30">
                <span>Total a Pagar</span>
                <span className="text-[#F26522]">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Forma de Pagamento Pix Manual */}
            <div className="bg-[#092B4C]/60 border border-[#165A8C] rounded-xl p-3 text-xs text-[#A3B8CC] flex items-center gap-2">
              <QrCode className="w-6 h-6 text-[#F26522] shrink-0" />
              <div>
                <span className="font-bold text-white block">Pix Manual com WhatsApp</span>
                <span>Chave Pix da loja e envio de comprovante no próximo passo.</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#F26522] hover:bg-[#F26522]/90 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F26522]/30 active:scale-95 transition"
            >
              {submitting ? (
                <span>Gravando Pedido...</span>
              ) : (
                <>
                  <span>Concluir Pedido & Pagar Pix</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
