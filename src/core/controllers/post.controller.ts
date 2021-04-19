import { Request, Response, NextFunction } from 'express';
import { IUser, UserModel } from '../models/user.model';
import { PostCreationValidation, PostModel } from '../models/post.model';
import { ICommonError } from '../models/interfaces/error.interface';
import { isValidObjectId } from 'mongoose';
import { type } from 'os';

let user: IUser | null;

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { limit, offset, status } = req.body;
    if (limit === null || limit === undefined || offset === null || offset === undefined || status === null || status === undefined) {
        const commonError: ICommonError = {
            statusCode: 400,
            message: "Bad request",
            details: "Properties 'limit', 'offset' and 'status' are required"
        };
        return res.status(commonError.statusCode).send(commonError);
    }

    if (status !== 'all' && status !== 'published' && status !== 'draft') {
        const commonError: ICommonError = {
            statusCode: 400,
            message: "Bad request",
            details: "Status must be 'all', 'published' or 'draft"
        };
        return res.status(commonError.statusCode).send(commonError);
    }

    if (limit < 0 || offset < 0) {
        const commonError: ICommonError = {
            statusCode: 400,
            message: "Bad request",
            details: "Properties 'limit' and 'offset' values must be non-negative."
        };
        return res.status(commonError.statusCode).send(commonError);
    }
    if (typeof (limit) !== 'number' || typeof (offset) !== 'number') {
        const commonError: ICommonError = {
            statusCode: 400,
            message: "Bad request",
            details: "Properties 'limit' and 'offset' must be numbers"
        };
        return res.status(commonError.statusCode).send(commonError);
    }

    const result = {
        limit: limit,
        offset: offset,
        total: status === 'all' ?
            await PostModel.countDocuments({}) :
            await PostModel.countDocuments({ status: status }),
        posts: status === 'all' ?
            await PostModel.find({}, {}, { skip: offset, limit: limit }).sort({ postDate: -1 }) :
            await PostModel.find({ status: status }, {}, { skip: offset, limit: limit }).sort({ postDate: -1 })
    };
    return res.status(200).json(result);
}

export const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
    if (!isValidObjectId(req.params.postId)) {
        return res.status(400).json(getErrorMessage("The object id is not valid", 400));
    }
    const post = await PostModel.findOne({ _id: req.params.postId });
    console.log(post);
    return res.status(200).json(post);
}

export const addPost = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    try {
        const author = await getAuthor(userId);
        const { value, error } = PostCreationValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(x => x.message) });
        }
        const newPost = new PostModel(value);
        newPost.author = author;
        const saved = await newPost.save();
        return res.status(200).json(saved);
    } catch (error) {
        return res.status(500).json(getErrorMessage("Unable to save new post", 500, error));
    }
}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if (!postId) {
        return res.status(400).json({ message: 'Bad request! "postId" is required.' });
    }
    if (!req.body) {
        return res.status(400).json({ message: 'Bad request! Post is required.' });
    }

    try {
        const post = await PostModel.findOne({ _id: postId });
        Object.assign(post, req.body);
        const updated = await post?.save()
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', details: error });
    }
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if (!postId) {
        return res.status(400).json({ message: 'Bad request! "postId" is required.' });
    }
    try {
        const deleted = await PostModel.findOneAndRemove({ _id: postId });
        res.status(200).json({ message: `Post with id:${postId}, was deleted successfully!` });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', details: error });
    }
}

export const addComment = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Delete post' });
}

export const likePost = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Delete post' });
}

export const sharePost = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: 'Delete post' });
}

const getAuthor = (userId: string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        if (user) resolve(`${user.firstName} ${user.lastName}`);
        const foundUser = await UserModel.findOne({ _id: userId });
        if (foundUser) {
            user = <IUser>foundUser;
            resolve(`${foundUser.firstName} ${foundUser.lastName}`)
        } else {
            reject('')
        }
    });

}

const getErrorMessage = (message: string, statusCode: number = 500, error?: any): ICommonError => {
    return error ? { message: message, statusCode: statusCode, details: error } : { message: message, statusCode: statusCode };
}