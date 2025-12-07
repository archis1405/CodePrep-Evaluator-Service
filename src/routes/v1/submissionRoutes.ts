import express from "express";
import { addSubmission } from "../../controller/submissionController";
import { validateCreateSubmissionDTO } from "../../validators/createSubmissionValidator";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDTO";

const submissionRouter = express.Router();
submissionRouter.post(
    '/' ,
    validateCreateSubmissionDTO(createSubmissionZodSchema),
    addSubmission);

export default submissionRouter;