import helper from "../helpers"

const authorize = (alowedRoles: string[]) => (req: AuthRequest, res: Response, next:NextFunction) => {
  if (!req.user) return next(helper.errorHandler(401));
  
  if(!alowedRoles.includes(req.user.role)) {return next(helper.errorHandler(403))}
  
  next();
}

export default {authorize}