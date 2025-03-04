import { Router } from "express";
import * as controllers from "../controllers/index.controller";
import { apiKeyVerificaton } from "../midlewares/apiKey.midleware";
import { auth } from "../midlewares/auth.midleware";

const postRouter = Router();

// Get all posts
postRouter.post("/paginated", apiKeyVerificaton, controllers.getPosts);

//Get posts statistics
postRouter.get("/stats", auth, controllers.getStats);

// Get post by id
postRouter.get("/:postId", auth, controllers.getSinglePost);

//Add new post
postRouter.post("/", auth, controllers.addPost);

//Update post
postRouter.patch("/:postId", auth, controllers.updatePost);

//Delete post
postRouter.delete("/:postId", auth, controllers.deletePost);

//Add new comment
postRouter.post("/:postId/comments", auth, controllers.addComment);

//Like post
postRouter.get("/:postId/like", auth, controllers.likePost);

//Share post
postRouter.post("/:postId/share", auth, controllers.sharePost);

export { postRouter };