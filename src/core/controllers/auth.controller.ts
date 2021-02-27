import { Request, Response, NextFunction } from "express";
import { ICommonError } from "../models/interfaces/error.interface";
import { UserModel, UserRegistrationValidation, UserLoginValidation } from "../models/user.model";
import { compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { config } from 'dotenv';

config();

export const register = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { username, email, password } = request.body;

    const { error, value } = UserRegistrationValidation.validate({
        username,
        email,
        password,
    });

    if (error) {
        const { details } = error;
        const commonError: ICommonError = {
            statusCode: 400,
            message: details[0].message,
        };
        return response.status(400).json(commonError);
    } else {
        try {
            const exists = await UserModel.findOne({ email });

            if (exists) {
                const existsError: ICommonError = {
                    statusCode: 400,
                    message: "Email already in use",
                };
                return response.status(400).json(existsError);
            }

            const user = await new UserModel(value).save();
            return response.status(201).json({ message: 'Registration was successful!' });
        } catch (error) {
            const commonError: ICommonError = {
                statusCode: 400,
                message: JSON.stringify(error, null, 2),
            };
            return response.status(400).json(commonError);
        }
    }
};

export const login = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { error, value } = UserLoginValidation.validate(request.body);

    if (error) {
        const commonError: ICommonError = {
            statusCode: 400,
            message: error.details[0].message
        };
        return response.status(400).json(commonError);
    }

    const user = await UserModel.findOne({ email: value.email })

    if (!user) {
        const commonError: ICommonError = {
            statusCode: 401,
            message: "Email and password, does not match."
        };
        return response.status(401).json(commonError);
    }

    const match = await compare(value.password, user.password);

    if (!match) {
        const commonError: ICommonError = {
            statusCode: 401,
            message: "Email and password, does not match."
        };
        return response.status(401).json(commonError);
    }

    try {
        const token = jwt.sign({ userId: user.id }, <string>process.env.JWT_SECRET, { expiresIn: "1d" });

        response.setHeader("X-Access-Token", `Bearer ${token}`);

        return response.status(200).send({
            message: 'Login Successful!', user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            }
        })
    } catch (e) {
        const commonError: ICommonError = {
            statusCode: 500,
            message: "Internal Server Error",
            details: e.toString()
        };
        return response.status(500).json(commonError);
    }
};