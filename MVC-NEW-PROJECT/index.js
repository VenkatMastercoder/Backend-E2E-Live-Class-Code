const express = require("express");
const app = express();
const userRouter = require("./router/userRouter");

app.use(express.json());

// API BASE URL : localhost:3000/v1
app.use("/v1",userRouter);

app.listen(3000);

/** 
 * 
 * mvc 
 * 
 * Model - Schema ✅
 *  
 * Router - New Express 
 *  - userRouter
 * 
 * Controller - Bussinees Logic
 *  - userController
 * 
 * Service - DB Logic
 *  - userService
 * 
 * **/