const { PrismaClient } = require("@prisma/client");
const express = require("express");

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
var jwt = require("jsonwebtoken");
const roleBasedMiddleware = require("./middleware/roleBasedMiddleware");

// Base URL
// Base URL - Router - Controller - Service

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", async (req, res) => {
  // Data from Frontend
  const data = req.body; // user email & pass

  console.log(data);

  // DB LOGIC
  const isuserexits = await prisma.cMSUser.findFirst({
    where: {
      email: data.email,
    },
  });

  if (isuserexits) {
    if (data.password === isuserexits.password) {
      // token Log Stamp + id + Role

      var access_token = jwt.sign(
        { user_id: isuserexits.cms_user_id, role: isuserexits.role },
        "key",
        { expiresIn: "1h" }
      );
      res.send(access_token);
    } else {
      res.send("Password Invaild");
    }
  } else {
    res.send("Go Register First");
  }
});

app.get("/admin", roleBasedMiddleware(["ADMIN"]) ,async (req, res) => {
  // Data from Frontend [ No Data only Token ]

  // DB LOGIC
  const user_data = await prisma.cMSUser.findMany({
    where: {
      role: "ADMIN",
    },
  });

  // DB TO Frontend
  // res.send(user_data);
});

app.get("/super-admin", roleBasedMiddleware(["SUPER_ADMIN"]) ,async (req, res) => {
    // Data from Frontend [ No Data only Token ]

    // DB LOGIC
    const user_data = await prisma.cMSUser.findMany();

    // DB TO Frontend
    res.json({ data: user_data });
  }
);

app.listen(3009);
