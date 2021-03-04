import { Router } from "express";
import { authRouter } from "./auth.routes";
import { postRouter } from './post.routes';

const router = Router();

// Auth
router.use("/auth", authRouter);

//Posts
router.use("/posts", postRouter);

export { router };