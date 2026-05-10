export interface OrderProductsItem {
  title: string;
  quantity: number;
  price: number;
}

export interface OrderPlaceProductsItem {
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
}

type ShippingOptions = "free" | "paid";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipping"
  | "delivered"
  | "canceled";

type PaymentMethods = "stripe" | "cashOnDelivery" | "checkPayment";

export interface PlaceOrder {
  billingFirstName: string;
  billingLastName: string;
  billingCompanyName?: string | null;
  billingStreet: string;
  billingCity: string;
  billingPostcode: string;
  billingCountry: string;
  billingPhone: string;
  billingEmail: string;

  shippingFirstName: string;
  shippingLastName: string;
  shippingCompanyName?: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingCountry: string;
  shippingPhone: string;
  shippingEmail: string;

  buyerEmail: string;
  contactNumber: string;

  deliveryOption: ShippingOptions;
  status: OrderStatus;

  paymentMethod: PaymentMethods;
  payment?: any;

  totalPrice: number;
  notes?: string | null;

  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
  }[];
}

export interface PlaceOrderBody {
  billingAddress: {
    firstName: string;
    lastName: string;
    companyName?: string;
    streetAddress: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
  };

  shippingAddress: {
    firstName: string;
    lastName: string;
    companyName?: string;
    streetAddress: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
  };

  buyerEmail: string;
  contactNumber: string;

  deliveryOption?: ShippingOptions;
  status?: OrderStatus;

  paymentMethod: PaymentMethods;
  payment?: unknown;

  totalPrice: number;
  notes?: string;

  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
  }[];
}
export interface IOrder extends PlaceOrder {
  id: string;
  createdAt: Date;
}
