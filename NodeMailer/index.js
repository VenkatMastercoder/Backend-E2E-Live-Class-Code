const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.json());

const sendMail = (toMail, message) => {
  // Step : 1 --> STMP : Create a Transporter

  // manb ccbi qnjm dkhj

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "venkatesangunaraj@gmail.com",
      pass: "manbccbiqnjmdkhj",
    },
  });

  const mailOptions = {
    from: "venkatesangunaraj@gmail.com",
    to: toMail,
    subject: "Test Mail",
    text: message,
    html: `<button>
        <a href="https://www.swiggy.com/">Click Me</a>
      </button>`,
  };

  transporter.sendMail(mailOptions);
};

app.post("/contact", async (req, res) => {
  // 1. Data from Frontend
  const data = req.body;

  // 2. DB LOGIC OR SOME BUSSINESS LOGIC
  // --> Node Mailer Work
  const mailData = await sendMail(data.toMail, data.message);

  // 3. DATA TO FRONTEND
  res.json({ message: "Mail Sended Scuessfully", data: mailData });
});

app.listen(3000);
