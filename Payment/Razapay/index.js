const express = require("express");

const app = express();

var jwt = require("jsonwebtoken");

const Razorpay = require("razorpay");
const crypto = require("crypto");

app.use(express.json());

var {
  validatePaymentVerification,
  validateWebhookSignature,
} = require("./node_modules/razorpay/dist/utils/razorpay-utils");
const { access } = require("fs");

// test or Live key
var instance = new Razorpay({
  key_id: "rzp_live_1AQs1tBPGctdko",
  key_secret: "eSF2CEM1YcX6wy8jzIScQS5z",
});

app.post("/order", async (req, res) => {
  const data = req.body;

  const payment_res = await instance.orders.create({
    amount: data.amount,
    currency: "INR",
    receipt: "receipt#1",
    partial_payment: false,
    notes: {
      key1: "value3",
      key2: "value2",
    },
  });

  console.log("1.Order:", payment_res);

  // db temp_order user

  res.send(payment_res);
});

app.post("/verify-payment", (req, res) => {
  const data = req.body;

  // Razorpay logic for generating razorpay_signature
  const secret = "0K1i0oZON95GieiGRACl8zBV";

  const res_ans = validatePaymentVerification(
    { order_id: data.razorpay_order_id, payment_id: data.razorpay_payment_id },
    data.razorpay_signature,
    secret
  );

  // Comparing the generated signature with the received signature
  if (res_ans) {
    // DB Logic
    res.status(200).json({ scuess: true, message: "Payment Successful" });

    // Tran & course Enroll Table
  } else {
    res.status(500).send("Payment not Legit");
  }
});

app.post("/verify-webhook", (req, res) => {
  const data = req.body;
  // Razorpay logic for generating razorpay_signature

  // Comparing the generated signature with the received signature
  if (res_ans) {
    res.status(200).json({ scuess: true, message: "Payment Successful" });

    // Tran & course Enroll Table
  } else {
    res.status(500).send("Payment not Legit");
  }
});

// token Based or CMS_ID & ROLE
app.post("/login", (req, res) => {
  // data from Frontend
  const data = req.body; // CMS_EAMIL & PASSWORD

  // DB Logic

  const access_token = jwt.sign(
    {
      data: { CMS_ID: "DW", ROLE: "ADMIN" },
    },
    "secret",
    { expiresIn: 60 * 60 }
  );
  const refresh_token = jwt.sign(
    {
      data: { CMS_ID: "DW", ROLE: "ADMIN" },
    },
    "secret",
    { expiresIn: 60 * 60 }
  );

  // 3. Data to Frontend
  res.data({
    data: {
      CMS_ID: "DW",
      ROLE: "ADMIN",
      token: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    },
  });
});

app.post("/razorpay/refund", async (req, res) => {
  try {
    // Data from Frontend
    const data = req.body; // paymentId , amount , CMS_ID

    var decoded = jwt.verify(data.access_token, "secret");
    const role = decoded.CMS_ID;
    const CMS_ID = decoded.CMS_ID;

    const isCMSUserExists = prisma.cms.findUniqe({
      where: {
        cms_id: data.CMS_ID,
      },
    });

    if (isCMSUserExists && isCMSUserExists.role === "ADMIN") {
      // DB Logic
      const res_data = await instance.payments.refund(data.payment_id, {
        amount: data.amount,
        speed: data.speed,
      });

      // Data to Frontend
      res.json({ message: res_data });
    } else {
      res.json({ message: "No access to Make this Request" });

    }
  } catch (err) {
    console.log(err);
  }
});
 
app.listen(3000);

// const sha = crypto.createHmac("sha256", secret);

// // Correct string concatenation
// sha.update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`);

// const generated_signature = sha.digest("hex");
