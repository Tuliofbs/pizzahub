import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PizzaHub Multi-Tenant Control — Sistema de Gestão para Pizzarias",
  description: "Plataforma multi-empresa para pizzarias com cardápio digital, montagem de pizza meio a meio, KDS de cozinha e pagamentos Pix com conferência via WhatsApp.",
  icons: {
    icon: "/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#031B33] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
