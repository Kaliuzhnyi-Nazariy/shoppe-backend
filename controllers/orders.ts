import { NextFunction, Request, Response } from "express";
import orderService from "../service/orders";
import downloadService from "../service/download";
import {
  controllerWrapper,
  ensureExists,
  errorHandler,
  getParam,
  getUserData,
  isGuestMode,
  // verifyTokenHelper,
} from "../helpers";
import { prisma } from "../lib/prisma";
import { generatePDF } from "../utils";
// import { CustomRequest } from "../interfaces/customRequest";

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  const orders = await orderService.getMyOrders(id);
  res.status(200).json(orders);
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const id = await isGuestMode(req);

  const data = await isGuestMode(req);

  const orderId = getParam(req, "orderId", "Order id");

  const order = await orderService.getOrderById(orderId, data);
  // const order = await orderService.getOrderById(orderId, id);

  if (!order) return next(errorHandler(404, "Order is not found"));

  res.status(200).json(order);
};

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  // const token = req.headers.authorization;

  // const id: string | null = token ? await verifyTokenHelper(token) : null;

  const data = await isGuestMode(req);

  // get data
  // const {} = req.body;

  const order = await orderService.placeOrder({
    userId: data.id,
    orderData: req.body,
  });

  res.status(200).json(order);

  // try {
  //   //   res.sendStatus(201)
  // } catch (error) {
  //   next(error);
  // }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  // get data
  // const {} = req.body;

  const orderId = getParam(req, "orderId", "Order id");

  const result = await orderService.cancelOrder(orderId);

  res.status(200).json(result);

  // try {
  //   // await orderService.cancelOrder();
  //   //   res.sendStatus(201)
  // } catch (error) {
  //   next(error);
  // }
};

// admin

// const getOrders = async (req: Request, res: Response, next: NextFunction) => {
// const orders = await orderService.getOrders();
// res.status(200).json(orders);
// };

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const orderId = getParam(req, "orderId", "Order id");

  const data = await orderService.updateOrderStatus(orderId);

  res.status(200).json(data);
};

const deleteAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await orderService.deleteAllOrders();
  res.sendStatus(204);
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = getUserData(req);

  const { search } = req.query;

  const orders = await orderService.getOrders({
    id,
    role,
    search: search as string,
  });
  res.status(200).json(orders);
};

const downloadOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  const orderId = getParam(req, "orderId", "Order id");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Not found" });
  }

  await downloadService.postDownload(id, order.id, order.totalPrice.toString());

  return generatePDF(res, order);
};

export default {
  getMyOrders: controllerWrapper(getMyOrders),
  getOrderById: controllerWrapper(getOrderById),
  placeOrder: controllerWrapper(placeOrder),
  cancelOrder: controllerWrapper(cancelOrder),
  getOrders: controllerWrapper(getOrders),
  updateOrderStatus: controllerWrapper(updateOrderStatus),
  deleteAllOrders: controllerWrapper(deleteAllOrders),
  downloadOrder: controllerWrapper(downloadOrder),
};
