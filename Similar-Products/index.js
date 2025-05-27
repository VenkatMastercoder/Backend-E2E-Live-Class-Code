const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create a new product
app.post("/product", async (req, res) => {
  const { product_img, product_name, product_rating, product_prize } = req.body;
  const product = await prisma.product.create({
    data: {
      product_img,
      product_name,
      product_rating,
      product_prize,
    },
  });
  res.json(product);
});

// Create a new product description
app.post("/product-description", async (req, res) => {
  const {
    description,
    material,
    asset_required,
    delivery,
    product_include,
    product_highlights,
    product_id,
  } = req.body;
  const productDescription = await prisma.productDescription.create({
    data: {
      description,
      material,
      asset_required,
      delivery,
      product_include,
      product_highlights,
      product_id,
    },
  });
  res.json(productDescription);
});

// Create a new category
app.post("/categories", async (req, res) => {
  const { categories_name, product_id } = req.body;
  const category = await prisma.categories.create({
    data: {
      categories_name,
      product_id,
    },
  });
  res.json(category);
});

// Get all products
app.get("/product", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get("/product-description", async (req, res) => {
  const products = await prisma.productDescription.findMany();
  res.json(products);
});

// Get a single product by ID with its description and categories
app.get("/product/:id", async (req, res) => {
  // Data from Frontend
  const data = req.params;

  // DB Logic
  const products = await prisma.product.findUnique({
    where: {
      product_id: data.id,
    },
    include: {
      productDescription: true,
    },
  });

  const similarProducts = await prisma.product.findMany({
    where: {
      sub_categories_id: products.sub_categories_id,
    },
  });

  // Data TO Frontend
  res.json({ data: { products, similarProducts } });
});

// Start server
app.listen(3001, () => {
  console.log("Server started on http://localhost:5000");
});
