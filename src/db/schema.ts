import { pgTable, text, timestamp, boolean, integer, numeric, jsonb } from "drizzle-orm/pg-core";

// Empresas / Unidades (Tenants)
export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  phone: text("phone").notNull(),
  city: text("city").notNull().default("Limoeiro do Norte"),
  state: text("state").notNull().default("CE"),
  address: text("address").notNull(),
  active: boolean("active").notNull().default(true),
  // Configurações visuais e operacionais
  primaryColor: text("primary_color").notNull().default("#031B33"),
  accentColor: text("accent_color").notNull().default("#F26522"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  // Pagamento manual Pix por Tenant
  pixKeyType: text("pix_key_type").notNull().default("CNPJ"), // CNPJ, CPF, EMAIL, PHONE, CHAVE_ALEATORIA
  pixKey: text("pix_key").notNull().default("52.883.190/0001-44"),
  pixReceiverName: text("pix_receiver_name").notNull().default("PizzaHub Brasil Alimentos LTDA"),
  pixBankName: text("pix_bank_name").notNull().default("Banco Inter"),
  // WhatsApp para envio do comprovante / conferência
  whatsappNumber: text("whatsapp_number").notNull().default("5588999998888"),
  // Taxa de entrega fixa padrão
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("5.00"),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }).notNull().default("20.00"),
  openingHours: text("opening_hours").notNull().default("18:00 às 23:30"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Usuários do sistema (Master, Admin Empresa, Funcionário da Cozinha/Balcão, Cliente)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hash ou senha de teste autenticada
  role: text("role").notNull().default("customer"), // 'master' | 'admin' | 'staff' | 'customer'
  tenantId: text("tenant_id").references(() => tenants.id), // Nulo se for master global ou cliente global
  phone: text("phone"),
  googleAuth: boolean("google_auth").default(false),
  active: boolean("active").notNull().default(true),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categorias de Produtos
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  icon: text("icon").notNull().default("Pizza"), // Pizza, Utensils, CupSoda, IceCream
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

// Produtos (Pizzas, Bebidas, Calzones, Sobremesas, etc.)
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  categoryId: text("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  promotionalPrice: numeric("promotional_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  isPizza: boolean("is_pizza").notNull().default(false), // se suporta 2 sabores, borda recheada
  sizesAvailable: jsonb("sizes_available").$type<string[]>(), // ['P', 'M', 'G', 'Família']
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Grupos de Adicionais / Bordas / Sabores extras
export const productAddons = pgTable("product_addons", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  name: text("name").notNull(), // ex: "Bordas Recheadas", "Adicionais"
  category: text("category").notNull().default("border"), // 'border' | 'extra'
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  available: boolean("available").notNull().default(true),
});

// Pedidos
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  code: text("code").notNull(), // ex: "#PZ-1042"
  tenantId: text("tenant_id").references(() => tenants.id).notNull(),
  customerId: text("customer_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  // Tipo de entrega
  deliveryType: text("delivery_type").notNull().default("delivery"), // 'delivery' | 'pickup' | 'dine_in'
  addressStreet: text("address_street"),
  addressNumber: text("address_number"),
  addressNeighborhood: text("address_neighborhood"),
  addressCity: text("address_city"),
  addressComplement: text("address_complement"),
  tableNumber: text("table_number"), // caso seja dine_in
  // Totais financeiros (em decimal com 2 casas)
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0.00"),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  // Pagamento manual Pix com conferência
  paymentMethod: text("payment_method").notNull().default("PIX_MANUAL"),
  paymentStatus: text("payment_status").notNull().default("PENDING_VERIFICATION"), // 'PENDING_VERIFICATION' | 'CONFIRMED' | 'REJECTED'
  pixReceiptInfo: text("pix_receipt_info"), // código txid ou notas do comprovante informado pelo cliente
  pixConfirmedByUserId: text("pix_confirmed_by_user_id").references(() => users.id),
  pixConfirmedAt: timestamp("pix_confirmed_at"),
  // Status do Pedido na Cozinha / Balcão
  status: text("status").notNull().default("PENDING"), 
  // 'PENDING' -> 'RECEIVED' -> 'PREPARING' -> 'READY' -> 'OUT_FOR_DELIVERY' -> 'DELIVERED' -> 'CANCELLED'
  notes: text("notes"),
  // Histórico de auditoria / timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Itens do Pedido
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").references(() => orders.id).notNull(),
  productId: text("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  size: text("size"), // P, M, G, Família
  selectedAddons: jsonb("selected_addons").$type<{ name: string; price: number }[]>(),
  secondFlavor: text("second_flavor"), // meio a meio
  notes: text("notes"),
});

// Logs de Auditoria / Histórico de ações críticas
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id"),
  userId: text("user_id"),
  userName: text("user_name"),
  action: text("action").notNull(), // 'ORDER_STATUS_CHANGED', 'PIX_CONFIRMED', 'TENANT_CREATED', etc.
  details: text("details").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
