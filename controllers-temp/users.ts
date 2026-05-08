import type { Request, Response, NextFunction } from "express";
import userService from "../service/users";
import { getUserData } from "../helpers";
import { CustomRequest } from "../interfaces/customRequest";

const getUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  try {
    const data = await userService.getUser(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  try {
    const data = await userService.updateUser({ ...req.body, id });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = getUserData(req);

  try {
    await userService.deleteUser(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default { getUser, updateUser, deleteUser };
