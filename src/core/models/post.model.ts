import { Schema, model } from "mongoose";
import Joi from "@hapi/joi";
import { Document } from "mongoose";
import { CategorySchema } from './category.model';

export interface IPost extends Document {
    title: string;
    preview: string;
    postDate: string;
    author: string;
    imageUrl: string;
    content: string;
    comments?: IComment[];
    likes?: number;
    shares?: number
    category?: any;
    tags?: string[];
}

export interface IComment {
    by: string;
    on: Date;
    comment: string;
}

export const CommentSchema = new Schema({
    by: { type: String, required: true, default: "" },
    on: { type: Date, required: true, default: new Date() },
    comment: { type: String, required: true, default: "" },
});

export const PostSchema = new Schema(
    {
        title: { type: String, min: 10, required: true, unique: true, default: "" },
        preview: { type: String, min: 10, required: true, default: "", },
        postDate: { type: Date, required: true, default: new Date() },
        author: { type: String, required: true, unique: true },
        imageUrl: { type: String },
        content: { type: String, required: true },
        comments: { type: [CommentSchema], default: [] },
        likes: { type: Number },
        shares: { type: Number },
        category: { type: CategorySchema },
        tags: { type: [String] }
    },
    { timestamps: true }
);


export const PostModel = model<IPost>("Post", PostSchema);

export const PostCreationValidation = Joi.object({
    title: Joi.string().min(10).required().allow(''),
    preview: Joi.string().min(10).required().allow(''),
    postDate: Joi.date().required(),
    author: Joi.string().required(),
    imageUrl: Joi.string(),
    content: Joi.string().required(),
    comments: Joi.array().optional(),
    likes: Joi.number().optional(),
    shares: Joi.number().optional(),
    category: Joi.object().optional(),
    tags: Joi.array().optional()
});
