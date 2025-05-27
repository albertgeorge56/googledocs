import { body } from "express-validator";

export default class DocumentValidator {
  static update = [
    body("title")
      .optional()
      .isLength({ min: 0, max: 25 })
      .withMessage("Title must be 0 to 25 characters"),
    body("content")
      .optional()
      .custom((val) => {
        try {
          JSON.parse(val);
        } catch (error) {
          console.log(error);
          throw new Error("Invalid document content");
        }
      }),
    body("isPublic")
      .optional()
      .isBoolean()
      .withMessage("Must provide true or false value"),
  ];
}
