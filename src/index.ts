require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileUpload());

app.post("/sendmail", (req, res) => {
  const body = req.body;
  const file = req.files.attachment;
  file.mv("./temp/" + file.name, function (err) {
    if (err) return res.status(500).send(err);
  });
  console.log(req.files.attachment);
  console.log(body);
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
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
    attachments: [
      {
        fileName: file.name,
        path: "./temp/" + file.name,
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send("Error: " + error);
    } else {
      res.send("Palaute lähetetty!");
      fs.unlink("./temp/" + file.name, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  });
});

const port = process.env.PORT;

app.listen(port, () =>
  console.log(`Email sender is listening on port ${port}!`)
);
