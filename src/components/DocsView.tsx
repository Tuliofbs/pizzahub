"use client";

import React from "react";
import {
  FileCode2,
  ShieldCheck,
  Layers,
  Database,
  Lock,
  PhoneCall,
  CheckCircle,
  Server,
  Zap,
} from "lucide-react";

export function DocsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white">
      {/* Header Docs */}
      <div className="bg-[#031B33] border border-[#165A8C]/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <span className="text-xs font-bold text-[#F26522] uppercase tracking-wider">
          Documentação de Engenharia & Manual de Entrega
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
          PizzaHub — Arquitetura Multi-Tenant
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#A3B8CC]">
          Especificação técnica, matriz de papéis (RBAC), segurança por isolamento de escopo (tenantId),
          fluxo de conferência de Pix manual com WhatsApp e instruções de implantação.
        </p>
      </div>

      {/* 1. Perfis de Acesso & Matriz de Permissões */}
      <div className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#F26522]" />
          <span>1. Perfis de Acesso (RBAC) e Isolamento</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#092B4C]/60 border border-[#165A8C]/40 space-y-2">
            <span className="font-bold text-purple-400 block uppercase">
              Admin Master (Global)
            </span>
            <p className="text-[#A3B8CC]">
              Responsável pela criação de novas empresas/unidades, métricas globais de faturamento da rede de franquias e auditoria irrestrita.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#092B4C]/60 border border-[#165A8C]/40 space-y-2">
            <span className="font-bold text-[#F26522] block uppercase">
              Administrador da Empresa (Gerente de Loja)
            </span>
            <p className="text-[#A3B8CC]">
              Gerencia exclusivamente sua filial (ex: Limoeiro Centro). Acesso a conferência e aprovação do Pix manual, ajuste do cardápio, relatórios em CSV e dados bancários.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#092B4C]/60 border border-[#165A8C]/40 space-y-2">
            <span className="font-bold text-amber-400 block uppercase">
              Funcionário (Cozinha & Balcão - KDS)
            </span>
            <p className="text-[#A3B8CC]">
              Acesso à esteira de produção: pedidos recebidos, avanço para "No Forno" (PREPARING), "Pronto", "Saiu Entrega" e conferência rápida de Pix.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#092B4C]/60 border border-[#165A8C]/40 space-y-2">
            <span className="font-bold text-sky-400 block uppercase">
              Cliente (Consumidor)
            </span>
            <p className="text-[#A3B8CC]">
              Navegação no cardápio, montagem de pizza meio a meio, seleção de bordas, checkout e disparo do comprovante Pix via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Fluxo Financeiro: Pix Manual com Conferência WhatsApp */}
      <div className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-emerald-400" />
          <span>2. Fluxo Operacional: Pix Manual com Conferência</span>
        </h2>
        <div className="text-xs text-[#A3B8CC] space-y-3">
          <p>
            Conforme as diretrizes do projeto, não há gateway de pagamento online intermediário retendo taxas. O fluxo opera da seguinte forma:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-200">
            <li>
              <strong>Fechamento do Pedido:</strong> O cliente finaliza o carrinho e o sistema calcula subtotal, bordas e taxa de entrega fixa no servidor.
            </li>
            <li>
              <strong>Chave Pix Copiável:</strong> A tela de sucesso expõe a chave Pix cadastrada para aquela unidade específica (CNPJ, e-mail ou aleatória), o nome do titular e banco.
            </li>
            <li>
              <strong>Conexão WhatsApp:</strong> Um botão com deep link abre o WhatsApp da pizzaria com mensagem pré-formatada contendo o código do pedido, nome e valor para anexação do comprovante.
            </li>
            <li>
              <strong>Conferência Humana Obrigatória:</strong> O gerente ou funcionário confere no extrato ou no WhatsApp e clica em <em>"Confirmar Pix"</em> no KDS ou no Painel Administrativo.
            </li>
            <li>
              <strong>Liberação no Forno:</strong> O status transita para <em>PREPARING</em> e a auditoria registra o usuário responsável pela aprovação.
            </li>
          </ol>
        </div>
      </div>

      {/* 3. Modo Apresentação & Isolamento */}
      <div className="bg-[#031B33] border border-[#165A8C]/40 rounded-2xl p-6 space-y-3">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#F26522]" />
          <span>3. Modo Apresentação e Demonstração Isolada</span>
        </h2>
        <p className="text-xs text-[#A3B8CC]">
          O botão de <strong>Modo Apresentação</strong> no cabeçalho exibe tarja de segurança permanente em todas as telas informando dados fictícios. O sistema conta ainda com um botão de reinicialização dos dados padrão para demonstrações comerciais a parceiros e franqueados.
        </p>
      </div>
    </div>
  );
}
