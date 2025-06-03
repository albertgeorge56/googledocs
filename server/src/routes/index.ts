import { Request, Response, Router } from "express";
import userRoute from "./user.routes";
import authRoute from "./auth.routes";
import documentRoute from "./document.routes";
import authMiddleware, { authorize } from "../middlewares/auth.middleware";
import RoleEnum from "../types/enums/role-enum";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorize([RoleEnum.SUPERADMIN]),
  async (req: Request, res: Response) => {
    return void res.sendStatus(200);
  }
);
router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/document", documentRoute);

export default router;
