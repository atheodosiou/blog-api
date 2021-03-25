import { Schema, model } from "mongoose";
import Joi from "@hapi/joi";
import { Document } from "mongoose";

export interface ICategory extends Document {
    category: string;
}

export const CategorySchema = new Schema(
    {
        category: { type: String, min: 3, required: true, unique: true },
    },
    { timestamps: true }
);


export const CategoryModel = model<ICategory>("Category", CategorySchema);

export const CategoryCreationValidation = Joi.object({
    category: Joi.string().min(3).required()
});
