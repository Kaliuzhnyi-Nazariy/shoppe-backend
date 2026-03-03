// customer

const getMyOrders = async (userId: string) => {};

const getOrderById = async (orderdId: string) => {};

const placeOrder = async () => {};

const cancelOrder = async (orderId: string) => {};

// admin

const getOrders = async () => {};

const updateOrderStatus = async (
  orderId: string,
  status: "paid" | "shipped" | "delivered" | "canceled",
) => {};

export default {
  getMyOrders,
  getOrderById,
  placeOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
};
