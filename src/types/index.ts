export type UserRole = "master" | "admin" | "staff" | "customer";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
  phone?: string | null;
  googleAuth?: boolean;
}

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  active: boolean;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  pixKeyType: string;
  pixKey: string;
  pixReceiverName: string;
  pixBankName: string;
  whatsappNumber: string;
  deliveryFee: string;
  minOrderAmount: string;
  openingHours: string;
}

export interface ProductItem {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: string;
  promotionalPrice: string | null;
  imageUrl: string | null;
  available: boolean;
  isPizza: boolean;
  sizesAvailable: string[] | null;
  sortOrder: number;
}

export interface ProductAddonItem {
  id: string;
  tenantId: string;
  name: string;
  category: "border" | "extra";
  price: string;
  available: boolean;
}

export interface OrderItemData {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  size?: string | null;
  selectedAddons?: { name: string; price: number }[] | null;
  secondFlavor?: string | null;
  notes?: string | null;
}

export type OrderStatus = "PENDING" | "RECEIVED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING_VERIFICATION" | "CONFIRMED" | "REJECTED";

export interface OrderData {
  id: string;
  code: string;
  tenantId: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup" | "dine_in";
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressNeighborhood?: string | null;
  addressCity?: string | null;
  addressComplement?: string | null;
  tableNumber?: string | null;
  subtotal: string;
  deliveryFee: string;
  discount: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  pixReceiptInfo?: string | null;
  pixConfirmedByUserId?: string | null;
  pixConfirmedAt?: string | null;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemData[];
  tenant?: TenantInfo;
}
