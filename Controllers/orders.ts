import { NextFunction, Request, Response } from "express";
import orderService from "../service/orders";

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  // const { userId } = req.user;

  try {
    // const orders = await orderService.getMyOrders();
    // res.status(200).json(orders.data);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { orderId } = req.params;

  if (!orderId) return next(new Error("order id is required"));

  try {
    // await orderService.getOrderById(orderId);
  } catch (error) {
    next(error);
  }
};

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  // get data
  // const {} = req.body;

  try {
    await orderService.placeOrder();
    //   res.sendStatus(201)
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  // get data
  // const {} = req.body;

  try {
    // await orderService.cancelOrder();
    //   res.sendStatus(201)
  } catch (error) {
    next(error);
  }
};

// admin

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getOrders();
    // res.status(200).json(orders.data)
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { orderId } = req.params;

  if (!orderId) return next(new Error("order id is required"));

  try {
    // await orderService.updateOrderStatus();
    // res.sendStatus(204)
  } catch (error) {
    next(error);
  }
};

export default {
  getMyOrders,
  getOrderById,
  placeOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
};
