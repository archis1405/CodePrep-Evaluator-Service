import { Job, Worker } from "bullmq";

import SampleJob from "../jobs/SampleJob";
import redisConnection from "../config/redisConfig";

export default function SampleWorker(queueName: string){
    console.log("Setting up the redis connection",redisConnection);

    new Worker(
        queueName , 
        async(job : Job)=>{
            console.log("Sample Job Worker processing the job",job);

            if(job.name == "SampleJob"){
                const sampleJobInstance = new SampleJob(job.data);

                sampleJobInstance.handle(job);

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