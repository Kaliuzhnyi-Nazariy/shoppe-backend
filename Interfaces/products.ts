export interface IProduct {
  // check how cloudinary works for pack of photos
  photos: string | string[];
  title: string;
  description: string;
  additionalInformation: string;
  price: number;
  amount: number;

  // add Reviews logic
  //   reviews: [];
}
