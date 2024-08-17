const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// App Instance
const app = express();
app.use(express.json()); // JSON

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/register", async (req, res) => {
  // Data from Frontend
  const { name, email, phone_number, password } = req.body;

  // Basic validation
  if (!name || !email || !phone_number || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res.status(409).json({ message: "User Already Exists" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          phonenumber: phone_number,
          password: hashedPassword,
        },
      });

      res
        .status(201)
        .json({ message: "User Created Successfully", data: newUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  // Data from Frontend
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist. Please register first." });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Remove password from user data
    const { password: userPassword, ...userData } = user;

    // Generate tokens
    const accessToken = jwt.sign({ user_id: user.user_id }, "HH KEY", {
      expiresIn: "3s",
    }); //  Temp Key

    const refreshToken = jwt.sign({ user_id: user.user_id }, "HH KEY", {
      expiresIn: "3s",
    }); // Main Key

    // Store refresh token in database
    await prisma.token.create({
      data: {
        user_id: user.user_id,
        refreshtoken: refreshToken,
      },
    });

    res.status(200).json({
      message: "Login successfully",
      data: userData,
      token: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/refresh", async (req, res) => {
  // Data from Frontend
  const { refreshToken } = req.body;

  // Basic validation
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    // Check if the refresh token is valid
    const tokenValid = await prisma.token.findFirst({
      where: {
        refreshtoken: refreshToken,
      },
    });

    if (!tokenValid) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Verify the refresh token
    jwt.verify(tokenValid.refreshtoken, "HH KEY", (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "User not authenticated", error: err.message });
      }

      // Generate a new access token
      const accessToken = jwt.sign({ user_id: tokenValid.user_id }, "HH KEY", {
        expiresIn: "2m",
      });

      return res.status(200).json({
        token: {
          accessToken,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/public", (req, res) => {
  res.json({ message: "This is a public route, accessible to everyone." });
});

const authToken = (req, res, next) => {
  console.log("1. Request Headers:", req.headers);

  // authorization : "Bearear DSXZCVSDCVD"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ["Bearear","DSXZCVSDCVD"]

  console.log("2. Authorization Header:", authHeader);
  console.log("3. Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Token not valid. Please log in." });
  }

  jwt.verify(token, "HH KEY", (err) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired." });
    } else {
      next();
    }
  });
};

app.get("/protected", authToken, (req, res) => {
  res.json({
    message:
      "This is a protected route, accessible only to authenticated users.",
  });
});

app.get("/app", authToken, (req, res) => {
  res.send("Hello");
});

app.listen(3008);
