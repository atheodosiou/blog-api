import { Router } from "express";
import * as controllers from "../controllers/index.controller";
import { auth } from "../midlewares/auth.midleware";

const mediaRouter = Router();

// Get all images
mediaRouter.get("/images", auth, controllers.getAllImages);

// Get all images
mediaRouter.delete("/images/:id", auth, controllers.deleteImage);


export { mediaRouter };