const express = require("express");
const router = express.Router();
const { getAllProductController, getProductByIDController, createProductController, updateProductController, deleteProductController } = require("../controller/productController");

// API : GET http://localhost:3000/v1/products
router.get("/products", getAllProductController);

router.get("/products/:product_id", getProductByIDController);

router.post("/products", createProductController);

router.put("/products", updateProductController);

router.delete("/products", deleteProductController);

module.exports = router;