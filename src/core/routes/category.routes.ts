import { Router } from "express";
import * as controllers from "../controllers/index.controller";
import { auth } from "../midlewares/auth.midleware";

const categoryRouter = Router();

// Get all categories
categoryRouter.get("/", auth, controllers.getAllCategories);
// Get all categories
categoryRouter.post("/", auth, controllers.addCategory);
// Get all categories
categoryRouter.delete("/:id", auth, controllers.deleteCategory);

export { categoryRouter };