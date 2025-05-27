const { getAllProductService, getProductByIDService, createProductService, updateProductService, deleteProductService } = require("../service/productService");

const getAllProductController = async (req, res) => {
  // 1.Data from Frontend

  // 2.DB Logic [ Service ]
  const productsData = await getAllProductService();

  // 3.Data to Frontend
  res.json({ message: "All Products Data", data: productsData });
};

const getProductByIDController = async (req, res) => {
  // 1.Data from Frontend
  const data = req.params;

  // 2.DB Logic [ Service ]
  const productsData = await getProductByIDService(data)

  // 3.Data to Frontend
  res.json({ message: "All Products Data", data: productsData });
};

const createProductController = async (req, res) => {
  // 1.Data from Frontend
  const data = req.body;

  // 2.DB Logic [ Service ]
  const newProductData = await createProductService(data)

  // 3.Data to Frontend
  res.json({ message: "Created Products Data", data: newProductData });
};

const updateProductController = async (req, res) => {
  // 1.Data from Frontend
  const data = req.body;

  // 2.DB Logic [ Service ]
  const productData = await updateProductService(data)

  // 3.Data to Frontend
  res.json({ message: "Updated Products Data", data: productData });
};

const deleteProductController = async (req, res) => {
  // 1.Data from Frontend
  const data = req.body;

  // 2.DB Logic [ Service ]
  await deleteProductService(data)

  // 3.Data to Frontend
  res.json({ message: "delete Products Data" });
};

module.exports = {
  getAllProductController,
  getProductByIDController,
  createProductController,
  updateProductController,
  deleteProductController,
};