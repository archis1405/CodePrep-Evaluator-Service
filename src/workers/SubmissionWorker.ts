import { Job, Worker } from "bullmq";

import SubmissionJob from "../jobs/SubmissionJob";
import redisConnection from "../config/redisConfig";

export default function SubmissionWorker(queueName: string){
    // console.log("Setting up the redis connection",redisConnection); DEBUG LOGGER

    new Worker(
        queueName , 
        async(job : Job)=>{
            // console.log("Submission Job Worker processing the job",job); DEBUG LOGGER

            if(job.name == "SubmissionJob"){
                const submissionJobInstance = new SubmissionJob(job.data);

                submissionJobInstance.handle(job);

                return {
                    status: 200,
                    message: "Job processed successfully"
                };
            }
        },
        {
            connection: redisConnection
        }

    );
}