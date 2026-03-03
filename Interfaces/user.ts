export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  role: "admin" | "customer";
}

export type SignIn = Pick<IUser, "email" | "password">;

export type SignUp = Omit<IUser, "id" | "role">;
