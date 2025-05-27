import { Router } from "express";
import AuthValidator from "../validators/auth.validator";
import AuthController from "../controllers/auth/auth.controller";
import validate from "../middlewares/validate.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", AuthValidator.login, validate, AuthController.login);
router.post(
  "/refresh-token",
  AuthValidator.refreshToken,
  validate,
  AuthController.refreshToken
);

router.delete("/logout", authMiddleware, AuthController.logout);

export default router;
