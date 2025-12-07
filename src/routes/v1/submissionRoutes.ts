import express from "express";
import { addSubmission } from "../../controller/submissionController";

const submissionRouter = express.Router();
submissionRouter.post('/' , addSubmission)

export default submissionRouter;