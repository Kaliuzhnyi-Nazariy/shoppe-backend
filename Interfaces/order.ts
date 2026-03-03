export interface OrderProductsItem {
  title: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  firstName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  postcode: string;
  city: string;
  phone: string;
  email: string;
  notes: string;
  products: OrderProductsItem[];
}
