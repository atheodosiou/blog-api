import { Request, Response, NextFunction } from 'express';
import { ICommonError } from '../models/interfaces/error.interface';
import { MediaModel } from '../models/media.model';
import fs from 'fs';

export const getAllImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const media = await MediaModel.find();
        return res.status(200).json({ media });
    } catch (e) {
        const errorMessage = getErrorMessage("Iternal Server Error", 500, e);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const image = await MediaModel.findOne({ _id: id });
    if (!image) {
        const errorMessage = getErrorMessage("Bad Request", 400, `Image with id: ${id} was not found.`);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }

    try {
        const fileExits = fs.existsSync(image.fileLocalPath);
        if (fileExits) {
            fs.unlinkSync(image.fileLocalPath);
            const status = await MediaModel.deleteOne({ _id: id });
            if (status.ok === 1 && status.deletedCount === 1) {
                return res.status(200).json({ message: "Image deleted successfully." });
            } else {
                return res.status(400).json({ message: 'Image was not found' })
            }
        }
    } catch (error) {
        const errorMessage = getErrorMessage("Iternal Server Error", 500, error);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}


const getErrorMessage = (message: string, statusCode: number = 500, error?: any): ICommonError => {
    return error ? { message: message, statusCode: statusCode, details: error } : { message: message, statusCode: statusCode };
}