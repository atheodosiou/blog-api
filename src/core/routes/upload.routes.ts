import { Router } from "express";
import * as controllers from "../controllers/index.controller";
import { auth } from "../midlewares/auth.midleware";
import multer, { Options } from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: Function) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/svg+xml"
    ) {
        cb(null, true); //Save file
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file), false); // Reject file
    }
};

const multerOptions: Options = {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Up to 5 MB
    },
    fileFilter: fileFilter
};

const upload = multer(multerOptions);

const uploadRouter = Router();

// upload images
uploadRouter.post("/images", auth, upload.single('image'), controllers.uploadImage);

export { uploadRouter };