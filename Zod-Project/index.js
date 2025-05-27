const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const { z } = require("zod");

const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ZOD APIs Working");
});


const userAddingSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(/^[A-Z][A-Za-z0-9!@#$%^&*()_+]{6,}$/, {
    message:
      "Password must start with a capital letter, contain at least one special character, and be more than 6 characters long.",
  }),
  age: z.string().min(2,{message:"Min 18 Age"}),
  dob: z.string(),
});

app.post("/add-user", async (req, res) => {
  try {
    // 1. Data from Frontend, Razapay , API - Res
    const data = userAddingSchema.parse(req.body);
  
    // 2. DB Logic
    const newUser = await prisma.user.create({
      data: {
        email:data.data.email,
        password: data.data.password,
        age: data.data.age,
        dob: data.data.dob,
      },
    });

    // 3. Data to Frontend
    res.send(newUser);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

app.listen(3000);
