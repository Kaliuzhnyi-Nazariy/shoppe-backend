export interface IAddReview {
  productId: string;
  email: string;
  name: string;
  comment: string;
  rating: number;
}

export type UpdateReview = Omit<IAddReview, "name" | "email" | "productId"> & {
  userId: string;
  reviewId: string;
};
