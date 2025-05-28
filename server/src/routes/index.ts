import { Router } from "express";
import userRoute from "./user.routes";
import authRoute from "./auth.routes";
import documentRoute from "./document.routes";
const router = Router();

// router.use();

router.use("/user", userRoute);
router.use("/auth", authRoute);
router.use("/document", documentRoute);

export default router;
