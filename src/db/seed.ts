import { db } from "@/db";
import { tenants, users, categories, products, productAddons, orders, orderItems } from "@/db/schema";

export async function seedInitialData() {
  const existingTenants = await db.select().from(tenants);
  if (existingTenants.length > 0) {
    return;
  }

  // Empresas/Pizzarias Reais e Independentes no Ceará rodando no app PizzaHub
  const tenantBellaNapoli = {
    id: "tenant-limoeiro-01",
    name: "Bella Napoli Forneria",
    slug: "bella-napoli",
    phone: "(88) 99844-3321",
    city: "Limoeiro do Norte",
    state: "CE",
    address: "Rua Coronel Malveira, 1420 - Centro",
    active: true,
    primaryColor: "#031B33", // Fundo do sistema
    accentColor: "#F26522",  // Laranja vibrante
    logoUrl: "/logo-icon.svg",
    pixKeyType: "CNPJ",
    pixKey: "48.201.890/0001-32",
    pixReceiverName: "Bella Napoli Forneria Ltda",
    pixBankName: "Banco do Brasil (Ag: 0628)",
    whatsappNumber: "5588998443321",
    deliveryFee: "6.00",
    minOrderAmount: "25.00",
    openingHours: "Terça a Domingo - 18h às 23h30",
  };

  const tenantDonCorleone = {
    id: "tenant-russas-02",
    name: "Don Corleone Pizzas Artesanais",
    slug: "don-corleone",
    phone: "(88) 99712-4455",
    city: "Russas",
    state: "CE",
    address: "Av. Dom Lino, 890 - Centro",
    active: true,
    primaryColor: "#1A0F0A", // Tons personalizados da empresa
    accentColor: "#E53935",  // Vermelho Italiano
    logoUrl: "/logo-icon.svg",
    pixKeyType: "EMAIL",
    pixKey: "financeiro@doncorleone.com.br",
    pixReceiverName: "Don Corleone Gastronomia Ltda",
    pixBankName: "Nubank",
    whatsappNumber: "5588997124455",
    deliveryFee: "7.00",
    minOrderAmount: "30.00",
    openingHours: "Todos os dias - 18h às 23h",
  };

  const tenantSertaoLenha = {
    id: "tenant-quixada-03",
    name: "Sertão a Lenha & Pizzas",
    slug: "sertao-a-lenha",
    phone: "(88) 99655-7788",
    city: "Quixadá",
    state: "CE",
    address: "Rua Rodrigues Júnior, 1150 - Universitário",
    active: true,
    primaryColor: "#081E15", // Verde Escuro Artesanal
    accentColor: "#10B981",  // Verde Esmeralda
    logoUrl: "/logo-icon.svg",
    pixKeyType: "PHONE",
    pixKey: "(88) 99655-7788",
    pixReceiverName: "Sertão a Lenha Restaurante Ltda",
    pixBankName: "Caixa Econômica",
    whatsappNumber: "5588996557788",
    deliveryFee: "5.50",
    minOrderAmount: "22.00",
    openingHours: "Todos os dias - 17h30 às 23h45",
  };

  const tenantLaRustica = {
    id: "tenant-moradanova-04",
    name: "La Rústica Pizzaria & Chopp",
    slug: "la-rustica",
    phone: "(88) 99733-1122",
    city: "Morada Nova",
    state: "CE",
    address: "Av. Santos Dumont, 412 - Triângulo",
    active: true,
    primaryColor: "#1C1427", // Roxo Profundo Gourmet
    accentColor: "#D97706",  // Âmbar Dourado
    logoUrl: "/logo-icon.svg",
    pixKeyType: "CNPJ",
    pixKey: "50.114.920/0001-88",
    pixReceiverName: "La Rústica Morada Nova Ltda",
    pixBankName: "Bradesco",
    whatsappNumber: "5588997331122",
    deliveryFee: "6.00",
    minOrderAmount: "25.00",
    openingHours: "Terça a Domingo - 18h às 23h30",
  };

  await db.insert(tenants).values([tenantBellaNapoli, tenantDonCorleone, tenantSertaoLenha, tenantLaRustica]);

  // Usuários do sistema
  const userMaster = {
    id: "user-master-01",
    name: "Carlos Master Hub",
    email: "master@pizzahub.com.br",
    password: "masterpassword123",
    role: "master",
    tenantId: null,
    phone: "(88) 99999-0001",
    active: true,
  };

  const userAdmin = {
    id: "user-admin-01",
    name: "Marcelo Gerente Bella Napoli",
    email: "gerente@pizzahub.com.br",
    password: "adminpassword123",
    role: "admin",
    tenantId: "tenant-limoeiro-01",
    phone: "(88) 99844-3321",
    active: true,
  };

  const userStaff = {
    id: "user-staff-01",
    name: "Ana Forneira & Balcão",
    email: "cozinha@pizzahub.com.br",
    password: "staffpassword123",
    role: "staff",
    tenantId: "tenant-limoeiro-01",
    phone: "(88) 99877-2211",
    active: true,
  };

  const userCustomer = {
    id: "user-customer-01",
    name: "Lucas Silva Ferreira",
    email: "lucas.cliente@gmail.com",
    password: "clientepassword123",
    role: "customer",
    tenantId: "tenant-limoeiro-01",
    phone: "(88) 98122-3344",
    googleAuth: true,
    active: true,
  };

  await db.insert(users).values([userMaster, userAdmin, userStaff, userCustomer]);

  // Categorias
  const catBurgers = {
    id: "cat-burgers-01",
    tenantId: "tenant-limoeiro-01",
    name: "Hambúrgueres",
    slug: "burgers",
    icon: "Burger",
    sortOrder: 1,
    active: true,
  };

  const catPizzas = {
    id: "cat-pizzas-02",
    tenantId: "tenant-limoeiro-01",
    name: "Pizzas Forno",
    slug: "pizzas",
    icon: "Pizza",
    sortOrder: 2,
    active: true,
  };

  const catMassas = {
    id: "cat-massas-03",
    tenantId: "tenant-limoeiro-01",
    name: "Massas & Calzones",
    slug: "pasta",
    icon: "Soup",
    sortOrder: 3,
    active: true,
  };

  const catBatatas = {
    id: "cat-batatas-04",
    tenantId: "tenant-limoeiro-01",
    name: "Batatas & Fritas",
    slug: "fries",
    icon: "Utensils",
    sortOrder: 4,
    active: true,
  };

  const catBebidas = {
    id: "cat-bebidas-05",
    tenantId: "tenant-limoeiro-01",
    name: "Bebidas & Chopp",
    slug: "drinks",
    icon: "CupSoda",
    sortOrder: 5,
    active: true,
  };

  const catSobremesas = {
    id: "cat-sobremesas-06",
    tenantId: "tenant-limoeiro-01",
    name: "Sobremesas",
    slug: "desserts",
    icon: "IceCream",
    sortOrder: 6,
    active: true,
  };

  await db.insert(categories).values([catBurgers, catPizzas, catMassas, catBatatas, catBebidas, catSobremesas]);

  // Bordas e Adicionais
  const addonsData = [
    {
      id: "addon-borda-catupiry",
      tenantId: "tenant-limoeiro-01",
      name: "Borda Recheada Catupiry Original",
      category: "border",
      price: "12.00",
      available: true,
    },
    {
      id: "addon-borda-cheddar",
      tenantId: "tenant-limoeiro-01",
      name: "Borda Recheada Cheddar Cremoso",
      category: "border",
      price: "12.00",
      available: true,
    },
    {
      id: "addon-borda-chocolate",
      tenantId: "tenant-limoeiro-01",
      name: "Borda Chocolate Belga",
      category: "border",
      price: "14.00",
      available: true,
    },
    {
      id: "addon-extra-queijo",
      tenantId: "tenant-limoeiro-01",
      name: "Mussarela Dupla Especial",
      category: "extra",
      price: "8.50",
      available: true,
    },
  ];

  await db.insert(productAddons).values(addonsData);

  // Produtos de Bella Napoli
  const productsData = [
    {
      id: "prod-classic-burger",
      tenantId: "tenant-limoeiro-01",
      categoryId: "cat-burgers-01",
      name: "Classic Burger Artesanal",
      description: "Blend bovino nobre 180g grelhado no fogo, queijo cheddar inglês derretido, cebola caramelizada, alface americana fresca e molho especial.",
      price: "34.90",
      promotionalPrice: "29.90",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: false,
      sizesAvailable: ["Individual Padrão", "Combo com Batata"],
      sortOrder: 1,
    },
    {
      id: "prod-chicken-tikka-pizza",
      tenantId: "tenant-limoeiro-01",
      categoryId: "cat-pizzas-02",
      name: "Pizza Pepperoni Suprema",
      description: "Molho de tomate pelati italiano, mozzarella premium, pepperoni artesanal fatiado tostado no forno a lenha e orégano verde.",
      price: "56.00",
      promotionalPrice: "49.90",
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: true,
      sizesAvailable: ["Média (6 fatias)", "Grande (8 fatias)", "Gigante (12 fatias)"],
      sortOrder: 2,
    },
    {
      id: "prod-nordestina",
      tenantId: "tenant-limoeiro-01",
      categoryId: "cat-pizzas-02",
      name: "Pizza Sertaneja (Carne de Sol)",
      description: "Carne de sol desfiada na manteiga da terra de Limoeiro, queijo coalho artesanal gratinado, cebola roxa e cheiro verde fresco.",
      price: "59.90",
      promotionalPrice: "54.90",
      imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: true,
      sizesAvailable: ["Média (6 fatias)", "Grande (8 fatias)", "Gigante (12 fatias)"],
      sortOrder: 3,
    },
    {
      id: "prod-masala-fries",
      tenantId: "tenant-limoeiro-01",
      categoryId: "cat-batatas-04",
      name: "Batata Frita Rústica Crocante",
      description: "Batatas especiais em corte rústico fritas no ponto crocante perfeito, temperadas com sal marinho e páprica defumada.",
      price: "24.00",
      promotionalPrice: "19.90",
      imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: false,
      sizesAvailable: ["Porção Média", "Porção Família"],
      sortOrder: 4,
    },
    {
      id: "prod-lava-cake",
      tenantId: "tenant-limoeiro-01",
      categoryId: "cat-sobremesas-06",
      name: "Bolo Vulcão Chocolate Belga",
      description: "Petit gâteau artesanal de chocolate belga 70% com interior ultra cremoso, coroado com chantilly fresco e morango.",
      price: "28.00",
      promotionalPrice: "24.90",
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: false,
      sizesAvailable: ["Individual"],
      sortOrder: 5,
    },
    {
      id: "prod-coca-cola-2l",
      tenantId: "tenant-limoeiro-01",
      categoryId: "cat-bebidas-05",
      name: "Coca-Cola Original 2 Litros",
      description: "Garrafa PET gelada 2L.",
      price: "14.00",
      promotionalPrice: "12.00",
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
      available: true,
      isPizza: false,
      sizesAvailable: ["2 Litros"],
      sortOrder: 6,
    },
  ];

  await db.insert(products).values(productsData);

  // Pedidos Exemplo
  const order1 = {
    id: "ord-1001",
    code: "#BN-1001",
    tenantId: "tenant-limoeiro-01",
    customerId: "user-customer-01",
    customerName: "Lucas Silva Ferreira",
    customerPhone: "(88) 98122-3344",
    deliveryType: "delivery",
    addressStreet: "Rua Sindulfo Chaves",
    addressNumber: "340",
    addressNeighborhood: "Centro",
    addressCity: "Limoeiro do Norte",
    addressComplement: "Apto 102",
    subtotal: "49.90",
    deliveryFee: "6.00",
    discount: "0.00",
    totalAmount: "55.90",
    paymentMethod: "PIX_MANUAL",
    paymentStatus: "CONFIRMED",
    pixReceiptInfo: "Pix TXID: 9812391024329 - Pago via BB às 19:42",
    pixConfirmedByUserId: "user-admin-01",
    pixConfirmedAt: new Date(Date.now() - 35 * 60 * 1000),
    status: "PREPARING",
    notes: "Sem orégano, por favor.",
    createdAt: new Date(Date.now() - 40 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  };

  await db.insert(orders).values([order1]);

  await db.insert(orderItems).values([
    {
      id: "item-101",
      orderId: "ord-1001",
      productId: "prod-chicken-tikka-pizza",
      productName: "Pizza Pepperoni Suprema",
      quantity: 1,
      unitPrice: "49.90",
      totalPrice: "49.90",
      size: "Grande (8 fatias)",
      selectedAddons: [{ name: "Borda Recheada Catupiry Original", price: 12.0 }],
      secondFlavor: null,
      notes: "Sem orégano",
    },
  ]);
}
