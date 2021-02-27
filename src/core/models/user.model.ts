import { Schema, model } from "mongoose";
import Joi from "@hapi/joi";
import { compare, hash } from "bcryptjs";
import { Document } from "mongoose";
import { config } from 'dotenv';

config();

export interface IUser extends Document {
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    password: string;
    created_at?: string;
    updated_at?: string;
}

export const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            min: 2,
            default: "",
        },
        lastName: {
            type: String,
            min: 2,
            default: "",
        },
        username: {
            type: String,
            min: 4
        },
        email: {
            type: String,
            required: true,
            unique: true,
            min: 4,
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 16,
        },
    },
    { timestamps: true, versionKey: false }
);

UserSchema.statics.findByCredentials = async (
    email: string,
    password: string
) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("There is no user with this email");
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new Error("Unable to login !isMatch");

    return user;
};

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
    const user: IUser & Document = this;
    // It is true at first create
    if (user.isModified("password"))
        user.password = await hash(user.password, parseInt(<string>process.env.BCRYPT_SALT));
    next();
});

export const UserModel = model<IUser>("User", UserSchema);

export const UserRegistrationValidation = Joi.object({
    username: Joi.string().min(4).optional(),
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().min(2).optional(),
    email: Joi.string().email().min(4).required(),
    password: Joi.string().alphanum().min(8).max(16).required(),
});

export const UserLoginValidation = Joi.object({
    email: Joi.string().email().min(4).required(),
    password: Joi.string().alphanum().min(8).max(1024).required(),
});