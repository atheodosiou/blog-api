import { Request, Response, NextFunction } from 'express';
import { ICommonError } from '../models/interfaces/error.interface';
import { CategoryModel, CategoryCreationValidation } from '../models/category.model';


export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await CategoryModel.find();
        return res.status(200).json(categories);
    } catch (e) {
        const errorMessage = getErrorMessage("Iternal Server Error", 500, e);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value } = CategoryCreationValidation.validate(req.body);
        if (error) {
            const errorMessage = getErrorMessage("Bad Request", 400, error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
        const newCategory = new CategoryModel(value);
        const savedCategory = await newCategory.save();
        return res.status(200).json(savedCategory);
    } catch (e) {
        const errorMessage = getErrorMessage("Iternal Server Error", 500, e);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.id;
        const status = await CategoryModel.deleteOne({ _id: categoryId });
        console.log(status);
        if (status.ok === 1 && status.deletedCount===1) {
            return res.status(200).json({ message: "Category deleted successfully." });
        } else {
            return res.status(400).json({message:'Category was not found'})
        }
    } catch (e) {
        const errorMessage = getErrorMessage("Iternal Server Error", 500, e);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}


const getErrorMessage = (message: string, statusCode: number = 500, error?: any): ICommonError => {
    return error ? { message: message, statusCode: statusCode, details: error } : { message: message, statusCode: statusCode };
}