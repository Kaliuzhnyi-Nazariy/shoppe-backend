// export interface IProduct {
//   // check how cloudinary works for pack of photos
//   photos: string | string[];
//   title: string;
//   description: string;
//   additionalInformation: string;
//   price: number;
//   amount: number;

//   // add Reviews logic
//   //   reviews: [];
// }

// export type IAddProduct = Omit<IProduct, "photos" | "additionalInformation"> & {
//   photos?: string | string[];
//   additionalInformation?: string;
// };

export interface IProduct {
  photos: string[];
  title: string;
  description: string;
  additionalInformation: string;
  price: number;
  amount: number;
  isArchived: boolean;
  rate: number;
}

export type IAddProduct = Omit<
  IProduct,
  "amount" | "photos" | "additionalInformation" | "isArchived" | "rate"
> &
  Partial<
    Pick<IProduct, "amount" | "photos" | "additionalInformation" | "isArchived">
  >;
