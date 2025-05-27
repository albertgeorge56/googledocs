import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import DocumentController from "../controllers/document/document.controller";
import DocumentValidator from "../validators/document.validator";
import validate from "../middlewares/validate.middleware";

const router = Router();
router.get("/:id", authMiddleware, DocumentController.getOne);
router.get("/", authMiddleware, DocumentController.getAll);
router.put(
  ":/id",
  authMiddleware,
  DocumentValidator.update,
  validate,
  DocumentController.update
);

router.post("/", authMiddleware, DocumentController.create);
router.delete("/:id", authMiddleware, DocumentController.delete);
