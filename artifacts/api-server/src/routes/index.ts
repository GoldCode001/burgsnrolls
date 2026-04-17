import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import menuRouter from "./menu.js";
import storageRouter from "./storage.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(menuRouter);
router.use(storageRouter);

export default router;
