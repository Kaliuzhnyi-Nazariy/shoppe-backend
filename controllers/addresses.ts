import { NextFunction, Request, Response } from "express";
import { controllerWrapper, getParam, getUserData } from "../helpers";
import service from "../service/addresses";

const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  const addresses = await service.getAddresses(id);
  res.status(200).json(addresses);
};

const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  const addressId = getParam(req, "addressId", "Address id");

  const address = await service.getAddressById({ userId: id, addressId });
  res.status(200).json(address);
};

const addAddress = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  const newAddress = await service.postAddress({ ...req.body, userId: id });

  res.status(201).json(newAddress);
};

const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  const addressId = getParam(req, "addressId", "Address Id");

  const newAddress = await service.updateAddress({
    ...req.body,
    userId: id,
    addressId,
  });
  res.status(200).json(newAddress);
};

const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  const addressId = getParam(req, "addressId", "Address id");

  const deletedAddress = await service.deleteAddress(id, addressId);

  res.status(200).json(deletedAddress);
};

export default {
  getAddresses: controllerWrapper(getAddresses),
  getAddressById: controllerWrapper(getAddressById),
  addAddress: controllerWrapper(addAddress),
  updateAddress: controllerWrapper(updateAddress),
  deleteAddress: controllerWrapper(deleteAddress),
};
