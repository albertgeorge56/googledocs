import { Router } from "express";
import UserValidator from "../validators/user.validate";
import UserController from "../controllers/user/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";

const router = Router();

router.post("/", UserValidator.register, validate, UserController.register);
router.put("/verify-email/:token", UserController.verifyEmail);
router.get(":/id", authMiddleware, UserController.getUser);
router.post(
  "/reset-password",
  UserValidator.resetPassword,
  validate,
  UserController.resetPassword
);
router.put(
  "/password/:token",
  UserValidator.confirmResetPassword,
  validate,
  UserController.confirmResetPassword
);
export default router;
