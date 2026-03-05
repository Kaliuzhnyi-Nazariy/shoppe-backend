import helper from "../helpers"
import type {CustomRequest} from "../Interfaces/customRequest.ts"
const authorize = (alowedRoles: string[]) => (req: CustomRequest, res: Response, next:NextFunction) => {
  if (!req.user) return next(helper.errorHandler(401));
  
  if(!alowedRoles.includes(req.user.role)) {return next(helper.errorHandler(403))}
  
  next();
}

export default {authorize}