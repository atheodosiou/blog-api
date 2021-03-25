import { Request, Response, NextFunction } from 'express';
import { ICommonError } from '../models/interfaces/error.interface';
import { config } from 'dotenv';
import { MediaModel, MediaCreationValidation } from '../models/media.model';

config();

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        try {
            const mediaToSave = new MediaModel({
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                fileLocalPath:req.file.path,
                filePath: `${req.protocol}://${req.hostname}:${process.env.PORT}/${req.file.path}`
            });
            const savedMedia = await mediaToSave.save();
            return res.status(200).json(savedMedia);
        } catch (e) {
            const errorMessage = getErrorMessage("Faild to save media", 500, e);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    } else {
        const errorMessage = getErrorMessage("There is no file to save.", 400);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}


const getErrorMessage = (message: string, statusCode: number = 500, error?: any): ICommonError => {
    return error ? { message: message, statusCode: statusCode, details: error } : { message: message, statusCode: statusCode };
}