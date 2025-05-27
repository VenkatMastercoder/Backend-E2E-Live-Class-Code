const { PrismaClient } = require("@prisma/client");
const express = require("express");
var jwt = require("jsonwebtoken");
var morgan = require("morgan");
const roleBasedMiddleware = require("./middleware/roleBasedMiddleware");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Working-V1 == Ecom APIs");
});

// KEY SEND
app.post("/auth/cms-user/login", async (req, res) => {
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
        { expiresIn: "30s" }
      );

      var refresh_token = jwt.sign(
        { user_id: isuserexits.cms_user_id, role: isuserexits.role },
        "refresh-key",
        { expiresIn: "1h" }
      );

      await prisma.refreshToken.create({
        data: {
          user_id: isuserexits?.cms_user_id,
          cms_user_id: isuserexits?.cms_user_id,
          Refresh_Token: refresh_token,
        },
      });

      const { password, ...data } = isuserexits;

      const user_data = data;

      res.json({
        message: "User Logged in Scuessfully",
        data: {
          user_data,
          token: {
            access_token,
            refresh_token,
          },
        },
      });
    } else {
      res.send("Password Invaild");
    }
  } else {
    res.send("Go Register First");
  }
});

app.post("/auth/cms-user/refresh", async (req, res) => {
  // data from frontend
  const data = req.body; //Refresh Token

  // DB Logic
  const tokenVaild = await prisma.refreshToken.findFirst({
    where: {
      Refresh_Token: data.refreshToken,
    },
    include: {
      cms_user: true,
    },
  });

  if (!tokenVaild) {
    return res.json({ message: "Token Not vaild" });
  } else {
    jwt.verify(
      tokenVaild.Refresh_Token,
      "refresh-key",
      function (err, decoded) {
        if (err === null) {
          const accessToken = jwt.sign(
            { user_id: tokenVaild.user_id, role: tokenVaild.cms_user.role },
            "key",
            {
              expiresIn: "2m",
            }
          );

          console.log("}}", accessToken);

          return res.json({
            token: {
              accessToken,
            },
          });
        } else {
          return res.json({ message: "User Not Authenticated", error: err });
        }
      }
    );
  }
});

app.get(
  "/cms-user",
  roleBasedMiddleware(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    // Data from FD
    const data = req.user_data;

    var cms_user;

    // DB Logic
    if (data.cms_user_role === "SUPER_ADMIN") {
      cms_user = await prisma.cMSUser.findMany();
    } else if (data.cms_user_role === "ADMIN") {
      cms_user = await prisma.cMSUser.findUnique({
        where: {
          cms_user_id: data.cms_user_id,
        },
      });
    }

    // Data to Frontend
    res
      .status(200)
      .json({ message: "Cms User Retive Scuessfully", data: cms_user });
  }
);

app.get(
  "/cms-user/:cmsid",
  // roleBasedMiddleware(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    // Data from FD
    const data = req.params;

    // DB Logic
    const cms_user = await prisma.cMSUser.findUnique({
      where: {
        cms_user_id: data.cmsid,
      },
    });

    // Data to Frontend
    res
      .status(200)
      .json({ message: "Cms User Retive Scuessfully", data: cms_user });
  }
);

app.post(
  "/cms-user",
  roleBasedMiddleware(["SUPER_ADMIN"]),
  async (req, res) => {
    // Data from FD
    const data = req.body;

    // DB Logic
    const cms_user = await prisma.cMSUser.create({
      data: {
        name: data.name,
        password: data.password,
        email: data.email,
        tag: data.tag,
        role: data.role,
        proof: data.proof,
        details: data.details,
      },
    });

    // Data to Frontend
    res
      .status(200)
      .json({ message: "Cms User created Scuessfully", data: cms_user });
  }
);

app.put(
  "/cms-user/:cmsid",
  roleBasedMiddleware(["SUPER_ADMIN"]),
  async (req, res) => {
    // Data from FD
    const data = req.body;
    const id = req.params;

    // DB Logic
    const cms_user = await prisma.cMSUser.update({
      where: {
        cms_user_id: id.cmsid,
      },
      data: {
        name: data.name,
        password: data.password,
        email: data.email,
        tag: data.tag,
        role: data.role,
        proof: data.proof,
        details: data.details,
      },
    });

    // Data to Frontend
    res
      .status(200)
      .json({ message: "Cms User updated Scuessfully", data: cms_user });
  }
);

app.delete(
  "/cms-user/:cmsid",
  roleBasedMiddleware(["SUPER_ADMIN"]),
  async (req, res) => {
    // Data from FD
    const data = req.params;

    // DB Logic
    await prisma.cMSUser.delete({
      where: {
        cms_user_id: data.cmsid,
      },
    });

    // Data to Frontend
    res.status(200).json({ message: "Cms User Deleted Scuessfully" });
  }
);

// PRODUCT API

app.get("/products", async (req, res) => {
  // Data from Frontend [ optional ]

  // DB Logic
  const productsData = await prisma.product.findMany();

  // Data to frontend
  res.json({ message: "product Data Fetched Scuessfully", data: productsData });
});

app.get("/products/:productID", async (req, res) => {
  // Data from Frontend [ optional ]
  const { productID } = req.params; // data.productID

  // DB Logic
  const productsData = await prisma.product.findUnique({
    where: {
      product_id: productID,
    },
  });

  const simliarProducts = await prisma.product.findMany({
    where: {
      catgory_name: productsData.catgory_name,
    },
  });

  // Data to frontend
  res.json({
    message: "product Data Fetched Scuessfully",
    data: { productsData, simliarProducts },
  });
});

app.post("/products", async (req, res) => {
  // Data from Frontend [ optional ]
  const data = req.body;

  // DB Logic
  const newProductsData = await prisma.product.create({
    data: {
      product_title: data.product_title,
      orignal_price: data.orignal_price,
      selling_price: data.selling_price,
      product_discount: data.product_discount,
      product_image: data.product_image,
      is_product_live: data.is_product_live,
      stock_count: data.stock_count,
      is_refundable: data.is_refundable,
      ware_house: data.ware_house,
      weight: data.weight,
      height: data.height,
    },
  });

  // Data to frontend
  res.json({
    message: "product Data Fetched Scuessfully",
    data: newProductsData,
  });
});

app.put("/products/:productID", async (req, res) => {
  // Data from Frontend [ optional ]
  const data = req.body;

  const { productID } = req.params;

  // DB Logic
  const newProductsData = await prisma.product.update({
    data: {
      product_title: data.product_title,
      orignal_price: data.orignal_price,
      selling_price: data.selling_price,
      product_discount: data.product_discount,
      product_image: data.product_image,
      is_product_live: data.is_product_live,
      stock_count: data.stock_count,
      is_refundable: data.is_refundable,
      ware_house: data.ware_house,
      weight: data.weight,
      height: data.height,
    },
    where: {
      product_id: productID,
    },
  });

  // Data to frontend
  res.json({
    message: "product Data Fetched Scuessfully",
    data: newProductsData,
  });
});

app.delete("/products/:productID", async (req, res) => {
  // Data from Frontend [ optional ]
  const { productID } = req.params;

  // DB Logic
  await prisma.product.delete({
    where: {
      product_id: productID,
    },
  });

  // Data to frontend
  res.json({
    message: "product Data delete Scuessfully",
  });
});

app.listen(3009);
