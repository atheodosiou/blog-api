import { Schema, model } from "mongoose";
import Joi from "@hapi/joi";
import { Document } from "mongoose";

export interface IMedia extends Document {
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    usedOnPost: String
}

export const MediaSchema = new Schema(
    {
        fileName: { type: String, min: 3, required: true },
        fileType: { type: String, min: 3, required: true },
        fileSize: { type: Number, min: 3, required: true },
        filePath: { type: String, min: 3, required: true },
        usedOnPost: { type: Schema.Types.ObjectId, ref: 'Post' }
    },
    { timestamps: true }
);


export const MediaModel = model<IMedia>("Media", MediaSchema);

export const MediaCreationValidation = Joi.object({
    fileName: Joi.string().min(3).required(),
    fileType: Joi.string().min(3).required(),
    fileSize: Joi.string().min(3).required(),
    filePath: Joi.string().min(3).required(),
    usedOnPost: Joi.string().min(3).optional()
});
