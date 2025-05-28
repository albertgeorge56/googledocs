import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import DocumentController from "../controllers/document/document.controller";
import DocumentValidator from "../validators/document.validator";
import validate from "../middlewares/validate.middleware";
import ShareValidator from "../validators/share.validator";
import ShareController from "../controllers/share/share.controller";

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
router.post(
  "/:id/share",
  authMiddleware,
  ShareValidator.create,
  validate,
  ShareController.create
);
router.delete(
  "/:documentId/share/:userId",
  authMiddleware,
  ShareController.delete
);

export default router;
