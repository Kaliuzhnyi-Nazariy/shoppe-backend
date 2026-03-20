export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
}

export type AddCartItem = Omit<CartItem, "id" | "price">;
