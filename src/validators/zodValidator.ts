/* eslint-disable @typescript-eslint/no-unused-vars */
import {  ZodSchema } from 'zod';
import { NextFunction, Request, Response } from 'express';

//Middleware function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (schema: ZodSchema<any>) => (
    
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
            success: false,
            message: "Invalid Request params recieved",
            data: {},
            error: error
        });
    }
};