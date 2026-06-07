import { Categories } from "@prisma/client";

export interface IProduct {
  photos: { link: string; id: string }[];
  title: string;
  description: string;
  additionalInformation: string;
  price: number;
  amount: number;
  isArchived: boolean;
  rate: number;
  categories: Categories[];
}

export interface IUpdateProduct {
  photos: string[];
  title: string;
  description: string;
  additionalInformation: string;
  price: number;
  amount: number;
  isArchived: boolean;
  rate: number;
  newPhotos: string[];
  categories: Categories[];
}

export type IAddProduct = Omit<
  IProduct,
  "amount" | "photos" | "additionalInformation" | "isArchived" | "rate"
> &
  Partial<
    Pick<IProduct, "amount" | "photos" | "additionalInformation" | "isArchived">
  >;
