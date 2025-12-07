import { ZodSchema } from 'zod';
import { CreateSubmissionDTO } from '../dtos/CreateSubmissionDTO';
import { NextFunction, Request, Response } from 'express';

//Middleware function
export const validateCreateSubmissionDTO = (schema: ZodSchema<CreateSubmissionDTO>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        schema.parse({
            ...req.body
        });

        next();
    } 
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid Request"
        });
    }
};