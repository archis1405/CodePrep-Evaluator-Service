import { Request , Response } from "express";
import { CreateSubmissionDTO } from "../dtos/CreateSubmissionDTO";

export function addSubmission(req: Request , res: Response){
    const submissionDto = req.body as CreateSubmissionDTO;
    console.log("SubmissionDTO :: ", submissionDto);

    return res.status(201).json({
        success: true,
        error: {},
        message: "Submission received successfully",
        data: submissionDto
    });
}