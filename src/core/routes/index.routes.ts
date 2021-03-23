import { Router } from "express";
import { authRouter } from "./auth.routes";
import { postRouter } from './post.routes';
import { uploadRouter } from './upload.routes';

const router = Router();

// Auth
router.use("/auth", authRouter);

//Posts
router.use("/posts", postRouter);

router.use("/upload", uploadRouter);

export { router };