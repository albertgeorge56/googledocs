import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "georgeynr@gmail.com",
    pass: "grace6590ynr",
  },
});

export default transporter;
