import type {Request, Response, NextFunction} from "express"
import userService from "../Service/users.ts"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.createUser()
  } catch(error){next(error)}
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  // get user id
  // const {userId} = req.user
  
  try {
    //const data = await userService.getUser(userId)
    
    //return data.data
  } catch(error) {
    next(error)
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
  } catch(error) {
    next(error)
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    // get user id
  // const {userId} = req.user
  
  try {
    // await userService.deleteUser(userId)
  } catch(error) {
    next(error)
  }
};


export default { createUser, getUser, updateUser, deleteUser }