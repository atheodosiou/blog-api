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
    content: any;
    status: 'published' | 'draft';
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
    at: { type: Date, required: true, default: new Date() },
    comment: { type: String, required: true, default: "" },
});

export const PostSchema = new Schema(
    {
        title: { type: String, min: 10, required: true, unique: true, default: "" },
        preview: { type: String, min: 10, required: true, default: "", },
        postDate: { type: Date, default: new Date() },
        author: { type: String, required: true },
        imageUrl: { type: String, required: true },
        content: { type: Schema.Types.Mixed, required: true },
        status: { type: String, enum: ['published', 'draft'], default: 'draft' },
        comments: { type: [CommentSchema], default: [] },
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        category: { type: CategorySchema },
        tags: { type: [String], default: [] }
    },
    { timestamps: true }
);


export const PostModel = model<IPost>("Post", PostSchema);

export const PostCreationValidation = Joi.object({
    title: Joi.string().min(10).required().allow(''),
    preview: Joi.string().min(10).required().allow(''),
    postDate: Joi.date().optional(),
    author: Joi.string().optional(),
    imageUrl: Joi.string().required(),
    content: Joi.object().required(),
    status: Joi.string().valid('published', 'draft'),
    comments: Joi.array().optional(),
    likes: Joi.number().optional(),
    shares: Joi.number().optional(),
    category: Joi.object().optional(),
    tags: Joi.array().optional()
});
