import { Request, Response, NextFunction } from 'express';

export const getPosts = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Get all posts' });
}

export const getSinglePost = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Get sigle post' });
}

export const addPost = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Add new post' });
}

export const updatePost = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Update post' });
}

export const deletePost = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Delete post' });
}