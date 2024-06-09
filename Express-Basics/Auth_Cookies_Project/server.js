const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cookie = require("cookie");

const app = express();

const prisma = new PrismaClient();

app.use(express.json()); // JSON

app.get("/", (req, res) => {
  res.send("Hello - Auth cookie");
});

app.post("/register", async (req, res) => {
  // Data from Frontend
  const userData = req.body;

  const userExits = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (userExits === null) {
    // DB Logic

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        password: hashedPassword,
      },
    });

    res.json({ message: "User Created Sucessfully", data: newUser });
  } else {
    res.json({ message: "User Already Exists" });
  }
});

app.post("/login", async (req, res) => {
  // Data from Frontend
  const userData = req.body;

  // Db Logic
  const userExits = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (userExits === null) {
    res.json({ message: "User Not Exists.go Register First" });
  } else {
    // 123456 // djfgpndpg
    const user = await bcrypt.compare(userData.password, userExits.password);

    if (user) {
      const { password, ...userData } = userExits; // Spread

      const accessToken = jwt.sign({ user_id: userExits.user_id }, "key", {
        expiresIn: "30s",
      }); // Temp Key

      const refreshToken = jwt.sign({ user_id: userExits.user_id }, "key", {
        expiresIn: "30d",
      }); // Main Key

      await prisma.refreshToken.create({
        data: {
          user_id: userExits?.user_id,
          Refresh_Token: refreshToken,
        },
      });

      res.cookie("refreshToken", refreshToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60,
        path: "/",
      });

      res.cookie("accessToken", accessToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60,
        path: "/",
      });

      res.json({
        message: "Login Sucessfully",
        data: userData,
        token: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      res.json({ message: "password Invaild" });
    }
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.send("cookie cleared");
});

app.post("/refresh", async (req, res) => {
  // data from frontend
  const data = req.body; //Refresh Token

  // DB Logic
  const tokenVaild = await prisma.refreshToken.findFirst({
    where: {
      Refresh_Token: data.refreshToken,
    },
  });

  console.log("::", tokenVaild.Refresh_Token);

  if (!tokenVaild) {
    return res.json({ message: "Token Not vaild" });
  } else {
    jwt.verify(tokenVaild.Refresh_Token, "key", function (err, decoded) {
      console.log(err);

      if (err === null) {
        const accessToken = jwt.sign({ user_id: tokenVaild.user_id }, "key", {
          expiresIn: "2m",
        });

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 60 * 60,
        });

        return res.send("true");
      } else {
        return res.json({ message: "User Not Authenticated", error: err });
      }
    });
  }
});

const authToken = (req, res, next) => {
  console.log("1.", req.headers);

  const authToken = req.headers.cookie;
  const token = authToken && authToken.accessToken;

  if (!token) {
    return res.send("go login Token Not vaild");
  } else {
    jwt.verify(token, "key", (err) => {
      if (err) {
        return res.send("Error");
      } else {
        next();
      }
    });
  }
};

app.get("/user/:user_id", authToken, async (req, res) => {
  // data from frontend

  const { user_id } = req.params;

  // DB Logic

  const data = await prisma.user.findUnique({
    where: {
      user_id: user_id,
    },
  });

  // res
  res.json({
    data: data,
  });
});

app.listen(4001);
