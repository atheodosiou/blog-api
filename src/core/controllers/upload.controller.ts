import { Request, Response, NextFunction } from 'express';
import { ICommonError } from '../models/interfaces/error.interface';
import { config } from 'dotenv';

config();

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ file:req.file,url:`${req.protocol}://${req.hostname}:${process.env.PORT}/${req.file.path}` });
}


const getErrorMessage = (message: string, statusCode: number = 500, error?: any): ICommonError => {
    return error ? { message: message, statusCode: statusCode, details: error } : { message: message, statusCode: statusCode };
}