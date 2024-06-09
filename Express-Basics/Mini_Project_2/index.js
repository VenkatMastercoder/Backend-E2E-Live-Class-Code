const { PrismaClient } = require("@prisma/client");
const express = require("express");

// This Express Instance
const app = express();
const prisma = new PrismaClient();

var morgan = require("morgan");

app.use((req, res, next) => {
  // Works
  console.log("Custom Middeware");
  next();
});

app.use(express.json()); // core

app.use(morgan("dev")); // third Party

app.get("/", async (req, res) => {
  // Data from Frontend

  // DB logic
  const productData = await prisma.product.findMany();

  // Data to Frontend

  res.json({ message: "product Retrieved Sucessfully", data: productData });
});


app.get("/app", (req, res) => {
  console.log("APP Endpoint");

  res.send("Hello");
});


app.get("/:id", async (req, res) => {
  // Data from Frontend
  const productId = req.params;

  // DB logic
  const productData = await prisma.product.findUnique({
    where: {
      id: productId.id,
    },
  });

  // Data to Frontend
  res.json({ message: "product Retrieved Sucessfully", data: productData });
});

app.post("/", async (req, res) => {
  // Data from Frontend
  const data = req.body;

  console.log(req.body);

  // DB logic
  const newData = await prisma.product.create({
    data: {
      id: data.id,
      image_url: data.image_url,
      title: data.title,
      rating: data.rating,
      timing: data.timing,
      location: data.location,
    },
  });

  // Data to Frontend
  res.json({ message: "product Created Sucessfully", data: newData });
});

app.put("/:id", async (req, res) => {
  // Data from Frontend
  const data = req.body;
  const productId = req.params;

  // DB logic
  const updatedData = await prisma.product.update({
    where: {
      id: productId.id,
    },
    data: {
      image_url: data.image_url,
      title: data.title,
      rating: data.rating,
      timing: data.timing,
      location: data.location,
    },
  });

  //  Data to Frontend
  res.json({ message: "product Created Sucessfully", data: updatedData });
});

app.delete("/:id", async (req, res) => {
  const productId = req.params;

  // Db Logic
  await prisma.product.delete({
    where: {
      id: productId.id,
    },
  });

  // Res
  res.json({ message: "product Delected Sucessfully" });
});

app.listen(3000);
