import { Request, Response, NextFunction } from "express";
import { ICommonError } from "../models/interfaces/error.interface";
import { config } from 'dotenv';
import * as jwt from "jsonwebtoken";

config();

//Token verification midlleware
export const auth = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            const commonError: ICommonError = {
                statusCode: 401,
                message: "Unauthorized",
            };
            return response.status(commonError.statusCode).send(commonError);
        }
        const token = authorization.replace(/^Bearer\s/, '');
        const decoded = jwt.verify(token, (<string>process.env.JWT_SECRET));
        (request as any).userId = (decoded as any).userId;
        next();
    } catch (error) {
        const commonError: ICommonError = {
            statusCode: 401,
            message: "Unauthorized",
        };
        return response.status(commonError.statusCode).send(commonError);
    }
};