import { Router } from "express";
import { authRouter } from "./auth.routes";
import { postRouter } from './post.routes';
import { uploadRouter } from './upload.routes';
import { mediaRouter } from './media.routes';
import { categoryRouter } from './category.routes';

const router = Router();

//Auth
router.use("/auth", authRouter);
//Posts
router.use("/posts", postRouter);
//Uploads
router.use("/upload", uploadRouter);
//Media
router.use('/media', mediaRouter)
//Categories
router.use('/categories', categoryRouter);

export { router };