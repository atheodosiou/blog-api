import { Schema, model } from "mongoose";
import Joi from "@hapi/joi";
import { compare, hash } from "bcryptjs";
import { Document } from "mongoose";
import { config } from 'dotenv';

config();

export interface IPost extends Document {
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    password: string;
    created_at?: string;
    updated_at?: string;
}

export const PostSchema = new Schema(
    {
        firstName: {
            type: String,
            min: 2,
            default: "",
        },
        lastName: {
            type: String,
            min: 2,
            default: "",
        },
        username: {
            type: String,
            min: 4
        },
        email: {
            type: String,
            required: true,
            unique: true,
            min: 4,
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 16,
        },
    },
    { timestamps: true, versionKey: false }
);


export const PostModel = model<IPost>("Post", PostSchema);

export const PostCreationValidation = Joi.object({
    username: Joi.string().min(4).optional(),
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().min(2).optional(),
    email: Joi.string().email().min(4).required(),
    password: Joi.string().alphanum().min(8).max(16).required(),
});
