import express from "express";
import { addSubmission } from "../../controller/submissionController";
import { validate } from "../../validators/zodValidator";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDTO";

const submissionRouter = express.Router();
submissionRouter.post(
    '/',
    validate(createSubmissionZodSchema),
    addSubmission);

export default submissionRouter;