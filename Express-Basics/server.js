const express = require("express");

// Instance of HTTP Server
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", async (req, res) => {
  // Frontend Data

  // Db Logic
  const data = await prisma.user.findMany();

  // Data to Frontend
  res.json({ data: data });
});

app.get("/:id", async (req, res) => {
  // Frontend Data
  const userId = req.params;
  console.log(userId.id);

  // Db Logic
  const data = await prisma.user.findUnique({
    where: {
      id: parseInt(userId.id),
    },
  });

  // Data to Frontend
  res.json({ data: data });
});

app.post("/", async (req, res) => {
  // Frontend Data
  const userData = req.body;

  console.log("ss", userData);
  // Db Logic
  const data = await prisma.user.create({
    data: {
      id: userData.id,
      name: userData.name,
    },
  });

  // Data to Frontend
  res.json({ data: data, message: "User As Been Created Sucessfully" });
});

app.put("/", async (req, res) => {
  // Frontend Data
  const userData = req.body;

  console.log("ss", userData);
  // Db Logic
  const data = await prisma.user.update({
    data: {
      id: userData.id,
      name: userData.name,
    },
    where : {
      id : userData.id
    }
  });

  // Data to Frontend
  res.json({ data: data, message: "User As Been Updated Sucessfully" });
});

app.delete("/", async (req, res) => {
  // Frontend Data
  const userData = req.body;

  console.log("ss", userData);
  // Db Logic
  const data = await prisma.user.delete({
    where : {
      id : userData.id
    }
  });

  // Data to Frontend
  res.json({ data: data, message: "User As Been deleted Sucessfully" });
});

app.listen(process.env.PORT);
