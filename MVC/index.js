const express = require("express");
const app = express();
const router = require("./src/router/index");

app.use(express.json()) // Global use
require('dotenv').config()

/**
 * API : GET http://localhost:3000/v1/products
 * 
 * API : GET http://localhost:3000/v1/products/:product_id
 * 
 * API : POST http://localhost:3000/v1/products
 * 
 * API : PUT http://localhost:3000/v1/products
 * 
 * API : DEL http://localhost:3000/v1/products
 * **/


// http://localhost:3000/v1
app.use("/v1",router)

app.listen(3001);