import type {CustomError} from "../Interfaces/customError.ts"

const errorMessages: Record<number, string> = {
  400: "Bad request!",
  401: "Unauthorized!",
  403: "Forbidden!",
  404: "Not found!",
  409: "Conflict!",
  500: "Server Error",
};

const errorHandler = (code: number; message = errorMessages[code])=> {
  const error = new Error();
  error.message = message;
  (error as CustomError).status = code;
  return error;
}

export default {errorHandler}