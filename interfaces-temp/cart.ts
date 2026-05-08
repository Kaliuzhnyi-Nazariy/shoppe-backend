export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
}

export type AddCartItem = Omit<CartItem, "id" | "price" | "cartId">;

export interface ICartProduct {
  id: string;
  title: string;
  description: string;
  photos: string[];
  rate: number;
  reviewCount: number;
  amount: number;
}

export interface ICartItem {
  id: string;
  quantity: number;
  userId: string | null;
  // userId: string;
  price: number;
  product: ICartProduct;
}
