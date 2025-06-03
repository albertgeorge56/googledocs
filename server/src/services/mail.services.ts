import { SendMailOptions } from "nodemailer";
import transporter from "../config/smtp.config";

export default class MailService {
  static sendMail = async (mailOptions: SendMailOptions) => {
    return transporter.sendMail(mailOptions);
  };
}
