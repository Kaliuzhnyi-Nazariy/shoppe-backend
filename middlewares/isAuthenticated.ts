import helper from "../helpers"

const {JWT_SECRET} = process.env;

export const isAuthenticated = async (req: Request, res:Response, next: NextFunction) => {
  const cookies = req.cookies;
 const token = cookies["token"];
 
 if (!token) return next(helper.errorHandler(401))
  
  const secret = new TextEncoder().encode(JWT_SECRET!);
  
  // verify token and get id
  
  next();
}