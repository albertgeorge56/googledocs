import { body } from "express-validator";
import UserService from "../services/user.services";

export default class UserValidator {
  static register = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must provider valid email address."),
    body("email").custom(async (value) => {
      const user = await UserService.findUserById(value);
      if (user) return Promise.reject("User with email already exists.");
      return true;
    }),
    body("password1")
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 to 25 characters"),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password1) throw new Error("Password must match.");
      return true;
    }),
  ];
  static resetPassword = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must provide a valid email"),
  ];
  static confirmResetPassword = [
    body("password1")
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 to 25 characters"),
    body("password1")
      .matches(/\d/)
      .withMessage("Password must contain atleast one number."),
    body("password2").custom((val, { req }) => {
      if (val !== req.body.password1) throw new Error("Password must match.");
      return true;
    }),
  ];
}
