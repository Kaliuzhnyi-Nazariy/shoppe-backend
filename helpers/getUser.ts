import { CustomRequest } from "../interfaces/customRequest";
import errorHandler from "./errorHandler";

const getUserData = (req: CustomRequest) => {
  const data = req.user;

  if (!data) throw errorHandler(401);

  return data;
};

export default getUserData;
