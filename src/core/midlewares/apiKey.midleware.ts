import { Request, Response, NextFunction } from "express";
import { ICommonError } from "../models/interfaces/error.interface";
import { config } from 'dotenv';

config();

//Token verification midlleware
export const apiKeyVerificaton = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { xapikey } = request.headers;
        if (!xapikey) {
            const commonError: ICommonError = {
                statusCode: 401,
                message: "Unauthorized",
            };
            console.log("no api key", xapikey);
            return response.status(commonError.statusCode).send(commonError);
        }
        if (xapikey && xapikey !== <string>process.env.API_KEY) {
            const commonError: ICommonError = {
                statusCode: 401,
                message: "Unauthorized",
                details: "wrong/invalid api key"
            };
            return response.status(commonError.statusCode).send(commonError);
        }
        next();
    } catch (error) {
        const commonError: ICommonError = {
            statusCode: 401,
            message: "Unauthorized",
        };
        return response.status(commonError.statusCode).send(commonError);
    }
};