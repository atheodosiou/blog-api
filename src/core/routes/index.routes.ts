import { Router } from "express";
import { authRouter } from "./auth.routes";

const router = Router();

// Auth
router.use("/auth", authRouter);

export { router };