const getProducts = async () => {};

const addProducts = async () => {};

const deleteProduct = async (productId: string) => {};

const updateProduct = async ({
  productId,
  ...data
}: {
  productId: string;
  data: any;
}) => {};

const updateProductAmount = async (
  productId: string,
  productNumber: string,
) => {};

export default {
  getProducts,
  addProducts,
  updateProduct,
  updateProductAmount,
  deleteProduct,
};
