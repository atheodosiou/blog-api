import { Request, Response, NextFunction } from 'express';
import { ICommonError } from '../models/interfaces/error.interface';
import { MediaModel } from '../models/media.model';


export const getAllImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const media = await MediaModel.find();
        return res.status(200).json({ media });
    } catch (e) {
        const errorMessage = getErrorMessage("Iternal Server Error", 500, e);
        return res.status(errorMessage.statusCode).json(errorMessage);
    }
}


const getErrorMessage = (message: string, statusCode: number = 500, error?: any): ICommonError => {
    return error ? { message: message, statusCode: statusCode, details: error } : { message: message, statusCode: statusCode };
}