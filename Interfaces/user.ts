export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: "admin" | "customer";
  password: string;
  email: string;

  orders: [];
  addresses: [];
  cart: [];
}

export type SignIn = Pick<IUser, "email" | "password">;

export type SignUp = Omit<
  IUser,
  "id" | "role" | "orders" | "addresses" | "cart"
> & {
  role?: "admin" | "customer";
};

export type UpdateUser = Pick<
  IUser,
  "id" | "firstName" | "lastName" | "displayName" | "email" | "password"
>;
