import "reflect-metadata";
import express, { NextFunction, Request, response, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "@shared/infra/typeorm";

import "@shared/container";

import { router } from './routes';
import swaggerFile from '../../../swagger.json';

import { AppError } from '@shared/errors/AppError';

const app = express();

const port = 3333;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use((err: Error, req: Request, res: Response, Next: NextFunction) => {
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }

    return res.status(500).json({
        status: "Error",
        message: `Internal server error - ${err.message}`
    })
});

app.listen(port, () => console.log(`server is running on port ${port}`))