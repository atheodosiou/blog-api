import express, { Request, Response, NextFunction } from 'express';
import { connectToDB } from './utils/db';
import { config } from 'dotenv';
import { router } from './core/routes/index.routes';
import morgan from "morgan";
import { accessLogger } from "./utils/morganLogger";
import { cors } from "./utils/cors";
import multer from 'multer';

config();

// Initialize express
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("combined", { stream: accessLogger }));

//Handle cors erros
app.use(cors)

// Routes
app.use("/uploads",express.static('uploads'));
app.use("/api/v1", router);

// Error handling uploads
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
        // fileUpload.js
        console.log(error.field)
        res.status(400).send({ error: "Invalid File format. Must be PNG,JPG,JPEG or SVG." })
    } else next();
});

// Error handling 404
app.use("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: `Not found ${req.baseUrl} not exists` });
});

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
    await connectToDB();
});