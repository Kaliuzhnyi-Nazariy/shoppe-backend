import type { Request, Response, NextFunction } from "express";
import userService from "../service/users";
import { CustomRequest } from "../interfaces/customRequest";
import { errorHandler } from "../helpers";

const getUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  // get user id
  const user = req.user;

  if (!user) throw errorHandler(401);

  try {
    const data = await userService.getUser(user.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  // get user id
  // const {userId} = req.user

  //get req.body
  // const {} = req.body;
  try {
    //const data = await userService.updateUser(userId)
    //return data.data
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  // get user id
  // const {userId} = req.user

  try {
    // await userService.deleteUser(userId)
  } catch (error) {
    next(error);
  }
};

export default { getUser, updateUser, deleteUser };
