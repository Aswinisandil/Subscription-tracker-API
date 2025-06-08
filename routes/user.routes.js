import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();
 
userRouter.get('/' , getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/' , createUser);

userRouter.put('/:id' , updateUser); //updates the user

userRouter.delete('/:id' , deleteUser);

export default userRouter;