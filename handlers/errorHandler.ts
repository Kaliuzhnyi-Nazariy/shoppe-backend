import type {CustomError} from "../Interfaces/"

const errorHandler = (error: CustomError, req: Request, res:Response, next: NextFunction) => {
  const {status = 500, message = "Server error"} = error;
  
  res.status(status).json({message})
}

export default {errorHandler}