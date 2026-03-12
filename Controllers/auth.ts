import { Request, Response, NextFunction } from "express";
import authService from "../service/auth";
import { cookieSettings, errorHandler } from "../helpers";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = await authService.signUp(req.body);

    res.cookie("token", token, cookieSettings);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = await authService.signIn(req.body);

    res.cookie("token", token, cookieSettings);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", cookieSettings);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await authService.forgetPassword(req.body.email);

    if (!data || !data.token) return next(errorHandler(500, "Sth went wrong"));

    res.status(200).json({ token: data.token });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { tokenId } = req.params;

  if (!tokenId)
    return res.status(400).json({ message: "token id is required" });

  try {
    await authService.resetPassword(
      tokenId as string,
      req.body.password,
      req.body.confirmPassword,
    );

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default { signUp, signIn, signOut, forgetPassword, resetPassword };
