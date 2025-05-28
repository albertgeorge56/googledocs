import { body } from "express-validator";
import PermissionEnum from "../types/enums/permission-enum";

export default class ShareValidator {
  static create = [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Must provide a valid email for sharing document with."),
    body("permission").custom((val) => {
      if (!Object.values(PermissionEnum).includes(val))
        throw new Error("Must provide valid permission");
      return true;
    }),
  ];
}
