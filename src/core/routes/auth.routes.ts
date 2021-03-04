import { Router } from "express";
import * as controllers from "../controllers/index.controller";

const authRouter = Router();

// Register
authRouter.post("/register", controllers.register);

// Login
authRouter.post("/login", controllers.login);

export { authRouter };