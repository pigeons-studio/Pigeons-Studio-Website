export const ORDER_KINDS = ['preorder', 'order'] as const;
export const ORDER_STATUSES = ['received', 'confirmed', 'making', 'ready', 'cancelled'] as const;
export type OrderKind = (typeof ORDER_KINDS)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderLine = {
  productId: string;
  nameFr: string;
  nameEn: string;
  color: string | null;
  quantity: number;
  priceLabel: string;
  detail: string | null;
};

export type OrderView = {
  id: string;
  kind: OrderKind;
  status: OrderStatus;
  name: string;
  email: string;
  locale: 'fr' | 'en';
  createdAt: string;
  items: OrderLine[];
};
