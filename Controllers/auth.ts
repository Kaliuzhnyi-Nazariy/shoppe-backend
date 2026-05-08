import { Request, Response, NextFunction } from "express";
import authService from "../service/auth";
import {
  controllerWrapper,
  cookieSettings,
  errorHandler,
  getParam,
  getUserData,
} from "../helpers";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = await authService.signUp(req.body);

  // res.cookie("token", token, cookieSettings);

  res.status(201).json({ token });
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = await authService.signIn(req.body);
  // const { token, role } = await authService.signIn(req.body);

  // res.cookie("token", token, cookieSettings);

  // res.status(200).json({ role });
  res.status(200).json({ token });
};

// const signOut = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     res.clearCookie("token", cookieSettings);

//     res.sendStatus(204);
//   } catch (error) {
//     next(error);
//   }
// };

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = await authService.forgetPassword(req.body.email);

  if (!data || !data.token) return next(errorHandler(500, "Sth went wrong"));

  res.status(200).json({ token: data.token });
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token, password, confirmPassword } = req.body;

  if (!token) return res.status(400).json({ message: "token is required" });

  await authService.resetPassword(token, password, confirmPassword);

  res.sendStatus(204);
};

const createUserCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token, idToResetPassword } = await authService.createCheckoutUser(
    req.body,
  );

  if (!token) errorHandler(404, "Request is not found");

  res.status(201).json({ token, idToResetPassword });
};

const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  const tokenId = getParam(req, "tokenId", "Token id");

  await authService.setPassword({
    tokenId,
    password: req.body.password,
  });

  res.sendStatus(200);
};

const resetPasswordRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = getUserData(req);

  await authService.askResetPassword(id);

  res.sendStatus(200);
};

export default {
  signUp: controllerWrapper(signUp),
  signIn: controllerWrapper(signIn),
  // signOut,
  forgetPassword: controllerWrapper(forgetPassword),
  resetPassword: controllerWrapper(resetPassword),
  createUserCheckout: controllerWrapper(createUserCheckout),
  setPassword: controllerWrapper(setPassword),
  resetPasswordRequest: controllerWrapper(resetPasswordRequest),
};
