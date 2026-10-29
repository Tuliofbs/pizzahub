"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { OrderData } from "@/types";
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  ChefHat,
  MapPin,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";

export function OrderSuccessView() {
  const { lastCreatedOrderId, activeTenant, setCurrentView } = useApp();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixReceiptText, setPixReceiptText] = useState("");
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [receiptSentMessage, setReceiptSentMessage] = useState("");

  const loadOrder = async () => {
    if (!lastCreatedOrderId) return;
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();
      if (data.success && data.orders) {
        const found = data.orders.find((o: OrderData) => o.id === lastCreatedOrderId);
        if (found) {
          setOrder(found);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOrder();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }, [lastCreatedOrderId]);

  const handleCopyPix = () => {
    if (!activeTenant?.pixKey) return;
    navigator.clipboard.writeText(activeTenant.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleSubmitReceipt = async () => {
    if (!pixReceiptText || !order) return;
    setSubmittingReceipt(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          action: "submit_pix_receipt",
          pixReceiptInfo: pixReceiptText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReceiptSentMessage("Comprovante / Código informado com sucesso! A equipe está conferindo.");
        loadOrder();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReceipt(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!order || !activeTenant) return "#";
    const phone = activeTenant.whatsappNumber || "5588998443321";
    const message = encodeURIComponent(
      `Olá, PizzaHub ${activeTenant.name}!\nAcabei de fazer o pedido *${order.code}* no valor de *R$ ${order.totalAmount}*.\nSeguem meus dados:\nNome: ${order.customerName}\nJá fiz o Pix e gostaria de confirmar!`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  if (!order) {
    return (
      <div className="py-20 text-center text-[#A3B8CC]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#F26522]" />
        <p>Carregando detalhes do seu pedido...</p>
      </div>
    );
  }

  const isPixPaid = order.paymentStatus === "CONFIRMED";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner de Sucesso */}
      <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#F26522] uppercase tracking-wider">
            Pedido Registrado com Sucesso
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {order.code}
          </h1>
          <p className="text-xs text-[#A3B8CC] mt-1">
            {activeTenant?.name} • Limoeiro do Norte, CE
          </p>
        </div>

        {/* Status de Pagamento e Cozinha */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-left">
          <div className="bg-[#092B4C] border border-[#165A8C]/50 rounded-xl p-3">
            <span className="text-[10px] text-[#A3B8CC] uppercase font-bold block">
              Status do Pix
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-1 mt-1 ${
                isPixPaid ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {isPixPaid ? "Pix Conferido & Aprovado" : "Aguardando Conferência"}
            </span>
          </div>

          <div className="bg-[#092B4C] border border-[#165A8C]/50 rounded-xl p-3">
            <span className="text-[10px] text-[#A3B8CC] uppercase font-bold block">
              Fila da Cozinha
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1 mt-1">
              <ChefHat className="w-4 h-4 text-[#F26522]" />
              {order.status === "PENDING"
                ? "Na Fila Inicial"
                : order.status === "PREPARING"
                ? "No Forno a Lenha"
                : order.status === "READY"
                ? "Pronto para Entrega"
                : order.status === "DELIVERED"
                ? "Entregue!"
                : order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Caixa de Pagamento Pix Manual */}
      <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#165A8C]/40 pb-3">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <span>Pagamento Pix Manual com WhatsApp</span>
          </h2>
          <span className="text-lg font-black text-[#F26522]">
            R$ {parseFloat(order.totalAmount).toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* Instruções do Pix */}
        <div className="bg-[#092B4C] border border-[#165A8C] rounded-2xl p-4 space-y-3">
          <div className="text-xs space-y-1">
            <p className="text-white font-bold">Dados Bancários da Pizzaria:</p>
            <p className="text-[#A3B8CC]">
              Beneficiário: <strong className="text-white">{activeTenant?.pixReceiverName}</strong>
            </p>
            <p className="text-[#A3B8CC]">
              Banco: <strong className="text-white">{activeTenant?.pixBankName}</strong>
            </p>
            <p className="text-[#A3B8CC]">
              Tipo de Chave: <strong className="text-white">{activeTenant?.pixKeyType}</strong>
            </p>
          </div>

          {/* Campo da Chave Copiável */}
          <div className="flex items-center gap-2 bg-[#031B33] p-2.5 rounded-xl border border-[#165A8C]/80">
            <div className="flex-1 font-mono text-xs font-bold text-emerald-400 break-all select-all">
              {activeTenant?.pixKey}
            </div>
            <button
              onClick={handleCopyPix}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                copiedPix
                  ? "bg-emerald-600 text-white"
                  : "bg-[#F26522] hover:bg-[#F26522]/90 text-white"
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedPix ? "Copiado!" : "Copiar Chave"}</span>
            </button>
          </div>
        </div>

        {/* Notificar pelo WhatsApp */}
        <div className="space-y-3">
          <p className="text-xs text-[#A3B8CC]">
            Após realizar a transferência no seu banco, envie o comprovante diretamente pelo WhatsApp da pizzaria para acelerar a liberação no forno:
          </p>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar Comprovante via WhatsApp ({activeTenant?.phone})</span>
          </a>
        </div>

        {/* Informar código TXID / Notas diretamente no sistema */}
        <div className="pt-2 border-t border-[#165A8C]/30 space-y-2">
          <label className="text-[11px] font-bold text-[#A3B8CC] uppercase block">
            Ou Informe o Código TXID / Detalhes do Pix Aqui:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: TXID ou nome de quem transferiu..."
              value={pixReceiptText}
              onChange={(e) => setPixReceiptText(e.target.value)}
              className="flex-1 bg-[#092B4C] border border-[#165A8C] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F26522]"
            />
            <button
              onClick={handleSubmitReceipt}
              disabled={submittingReceipt || !pixReceiptText}
              className="px-4 py-2 bg-[#165A8C] hover:bg-[#165A8C]/80 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>

          {receiptSentMessage && (
            <p className="text-xs text-emerald-400 font-semibold">{receiptSentMessage}</p>
          )}
        </div>
      </div>

      {/* Resumo dos Itens do Pedido */}
      <div className="bg-[#031B33] border border-[#165A8C]/40 rounded-3xl p-6 space-y-3">
        <h3 className="text-xs font-bold text-[#A3B8CC] uppercase tracking-wider">
          Itens Solicitados
        </h3>
        <div className="divide-y divide-[#165A8C]/30">
          {order.items?.map((it) => (
            <div key={it.id} className="py-2.5 flex justify-between text-xs">
              <div>
                <p className="font-bold text-white">
                  {it.quantity}x {it.productName}
                </p>
                {it.size && <p className="text-[#F26522] text-[11px]">{it.size}</p>}
                {it.secondFlavor && (
                  <p className="text-amber-400 text-[11px]">1/2 {it.secondFlavor}</p>
                )}
                {it.selectedAddons && it.selectedAddons.length > 0 && (
                  <p className="text-[#A3B8CC] text-[10px]">
                    Borda: {it.selectedAddons.map((b) => b.name).join(", ")}
                  </p>
                )}
              </div>
              <span className="font-bold text-white">
                R$ {parseFloat(it.totalPrice).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentView("kds")}
          className="flex-1 py-3 rounded-xl bg-[#165A8C]/60 hover:bg-[#165A8C] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
        >
          <ChefHat className="w-4 h-4" />
          <span>Ver na Cozinha (KDS)</span>
        </button>

        <button
          onClick={() => setCurrentView("menu")}
          className="flex-1 py-3 rounded-xl bg-[#092B4C] hover:bg-[#092B4C]/80 text-[#A3B8CC] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#165A8C]/40 transition"
        >
          <span>Fazer Outro Pedido</span>
        </button>
      </div>
    </div>
  );
}
