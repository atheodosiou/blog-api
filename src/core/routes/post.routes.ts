import { Router } from "express";
import * as controllers from "../controllers/index.controller";

const postRouter = Router();

// Get all posts
postRouter.get("/", controllers.getPosts);

// Get post by id
postRouter.get("/:postId", controllers.getSinglePost);

//Add new post
postRouter.post("/", controllers.addPost);

//Update post
postRouter.patch("/:postId", controllers.updatePost);

//Delete post
postRouter.delete("/:postId", controllers.deletePost);


export { postRouter };