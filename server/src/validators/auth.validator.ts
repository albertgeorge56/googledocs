import { body } from "express-validator";

export default class AuthValidator {
  static login = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must provide a valid email address."),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Must provide atleast 4 character password"),
  ];
  static refreshToken = [
    body("token").exists().withMessage("Must provide a valid token"),
  ];
}
