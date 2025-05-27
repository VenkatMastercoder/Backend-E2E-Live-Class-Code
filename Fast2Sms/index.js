const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");
const express = require("express");

const app = express();

app.use(express.json());

const prisma = new PrismaClient();

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.get("/", (req, res) => {
  res.send("API - Working");
});

// SEND OTP - CREATE , LOGIN , SYLASS SEND , NUMBER VER ,...
app.post("/send-otp", async (req, res) => {
  // Data from Frontend - Number
  const { phone_number } = req.body;

  // DB Logic or Redis Logic
  // OTP - 6 Digit
  // Sent - db

  const otp_number = await generateOtp();

  const ress = await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "q",
      message: otp_number,
      flash: 0,
      numbers: phone_number,
    },
    {
      headers: {
        authorization:
          "78OGP9EeZgomjCY3adwKQWtXspub25rLTUBM6HvhFqVS0fz4klMASXIOGiz5YUK93QgefP4BEHoF0Ntp",
        "Content-Type": "application/json",
      },
    }
  );

  if (ress.data.return) {
    const data = await prisma.otp.create({
      data: {
        channel: "SMS",
        phone_number: phone_number,
        otp_number: otp_number,
        otp_status: "Sended",
      },
    });

    res.json({ data: data });
  }

  // Data to Frontend
});

// RESEND OTP -- WORKING
app.post("/resend-otp", async (req, res) => {
  const { phone_number } = req.body;

  const otp_number = await generateOtp();

  const ress = await axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "q",
      message: otp_number,
      flash: 0,
      numbers: phone_number,
    },
    {
      headers: {
        authorization:
          "78OGP9EeZgomjCY3adwKQWtXspub25rLTUBM6HvhFqVS0fz4klMASXIOGiz5YUK93QgefP4BEHoF0Ntp",
        "Content-Type": "application/json",
      },
    }
  );

  if (ress.data.return) {
    await prisma.otp.create({
      data: {
        channel: "SMS",
        phone_number: phone_number,
        otp_number: otp_number,
        otp_status: "Sended",
      },
    });

    res.send("Otp send");
  }
});

// Verfiy OTP
app.post("/verify-otp", async (req, res) => {
  // Data from Frontend
  const { otp_id, otp_number } = req.body;


  // DB Logic

  const Store_otp = await prisma.otp.findUnique({
    where: {
      otp_id: otp_id,
    },
  });

  console.log(Store_otp.otp_number,otp_number)


  if (!Store_otp) {
    return res.json({ message: "Otp Not Found" });
  }

  if (Store_otp.otp_number !== otp_number) {
    return res.json({ message: "Invaild Otp" });
  }

  const createdAt = Store_otp.createdAt; // 9:10
  const expriesAt = createdAt + 5 // 9:15
  const now_date = new Date() // 9:12

  if (now_date > expriesAt) {
    return res.json({ message: "Otp Expired" });
  }

  prisma.otp.delete({
    where: {
      otp_id: Store_otp.otp_id,
    },
  });

  // Data to Frontend
  res.json({ message: "Logined" });
});

app.listen(3000);
