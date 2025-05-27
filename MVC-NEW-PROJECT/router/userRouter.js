const express = require("express");
const userRouter = express.Router();
const { getAllUserController, getUserByIDController,createUserController,updateUserController, deleteUserController } = require("../controller/userController");

userRouter.get("/users", getAllUserController);
userRouter.get("/users/:user_id", getUserByIDController);
userRouter.post("/users", createUserController);
userRouter.put("/users", updateUserController);
userRouter.delete("/users", deleteUserController);

module.exports = userRouter;
