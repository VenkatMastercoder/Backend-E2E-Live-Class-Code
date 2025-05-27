const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProductService = async () => {
  const productsData = await prisma.product.findMany();
  return productsData;
};

const getProductByIDService = async (data) => {
  const productsData = await prisma.product.findUnique({
    where: {
      product_id: data.product_id,
    },
  });
  return productsData;
};

const createProductService = async (data) => {
  const newProductData = await prisma.product.create({
    data: {
      product_img: data.product_img,
      product_name: data.product_name,
      product_rating: data.product_rating,
      product_prize: data.product_prize,
    },
  });
  return newProductData;
};

const updateProductService = async (data) => {
  const productData = await prisma.product.update({
    data: {
      product_img: data.product_img,
      product_name: data.product_name,
      product_rating: data.product_rating,
      product_prize: data.product_prize,
    },
    where: {
      product_id: data.product_id,
    },
  });

  return productData;
};

const deleteProductService = async (data) => {
  const productData = await prisma.product.delete({
    where: {
      product_id: data.product_id,
    },
  });
  return productData;
};

module.exports = {
  getAllProductService,
  getProductByIDService,
  createProductService,
  updateProductService,
  deleteProductService
};
