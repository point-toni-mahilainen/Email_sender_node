require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/sendmail", (req, res) => {
  const body = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    authMethod: "STARTTLS",
    auth: {
      type: "login",
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_TO,
    subject: body.subject,
    html:
      `<p>Lähettäjän nimi: <b>${body.name}</b></p>` +
      `<p>Lähettäjän sähköpostiosoite: <b>${body.emailAddress}</b></p><br/>` +
      `<p>Viesti:<br/> ${body.message}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send("Error: " + error);
    } else {
      res.send("Palaute lähetetty!");
    }
  });
});

const port = process.env.PORT;

app.listen(port, () =>
  console.log(`Email sender is listening on port ${port}!`)
);
