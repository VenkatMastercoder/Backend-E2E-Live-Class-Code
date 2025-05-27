const { PrismaClient } = require("@prisma/client");
const express = require("express");

const app = express();

app.use(express.json());

const prisma = new PrismaClient();

const Redis = require("ioredis");

const client = new Redis(
  "rediss://default:AY8wAAIjcDE0ZTkxNjk0YWRjYjg0ZWY1YWY1ZjBkMWI3ZjU5YmE4MHAxMA@clear-tuna-36656.upstash.io:6379"
);

// API - GET : localhost:3000/
app.get("/", (req, res) => {
  res.json({ message: "APIs Working" });
});

// API - GET : localhost:3000/users - Get all Students
app.get("/users", async (req, res) => {
  // 1. Data from Frontend

  const cacheusers = await client.get("user");
  if (cacheusers) {
    return res.status(200).json({
      message: "User Data ret Scuessfully",
      data: JSON.parse(cacheusers),
    });
  } else {
    // 2. DB Logic
    const usersData = await prisma.user.findMany();
    await client.set("user", JSON.stringify(usersData), "EX", 3600);

    // 3. Data to Frontend
    res
      .status(200)
      .json({ message: "User Data ret Scuessfully", data: usersData });
  }
});

// API - GET : localhost:3000/users/:user_id - Fetch only that user_id
app.get("/users/:user_id", async (req, res) => {
  // 1. Data from Frontend
  const data = req.params;

  const cacheuser = await client.get(`user${data.user_id}`);
  if (cacheuser) {
    return res.json({
      message: "User Data ret Scuessfully",
      data: JSON.parse(cacheuser),
    });
  } else {
    // 2. DB Logic
    const userData = await prisma.user.findUnique({
      where: {
        user_id: data.user_id,
      },
    });
    await client.set(
      `user${userData.user_id}`,
      JSON.stringify(userData),
      "EX",
      3600
    );
    // 3. Data to Frontend
    res.json({ message: "User Data ret Scuessfully", data: userData });
  }
});

// API - POST : localhost:3000/users/ - Create a Student
app.post("/users", async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB Logic
  const newuser = await prisma.user.create({
    data: {
      name: data.name,
      class: data.class,
      blood_group: data.blood_group,
      phone_number: data.phone_number,
    },
  });

  await client.del("user");

  // 3. Data to Frontend
  res
    .status(200)
    .json({ message: "New User Created Scuessfully", data: newuser });
});

// API - PUT : localhost:3000/users/:user_id - Update a Student
app.put("/users", async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB Logic
  const newupdatedData = await prisma.user.update({
    where: {
      user_id: data.user_id,
    },
    data: {
      name: data.name,
      class: data.class,
      blood_group: data.blood_group,
      phone_number: data.phone_number,
    },
  });

  await client.del(`user${data.user_id}`);
  await client.del(`user`);

  // 3. Data to Frontend
  res.json({ message: "User Data update Scuessfully", data: newupdatedData });
});

// API - DELETE : localhost:3000/users/:user_id - Delete a Student
app.delete("/users", async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB Logic
  await prisma.user.delete({
    where: {
      user_id: data.user_id,
    },
  });

  await client.del("user")
  await client.del(`user${data.user_id}`)

  // Data to Frontend
  res.status(200).json({ message: "User delete Scuessfully" });
});

app.listen(3000);
