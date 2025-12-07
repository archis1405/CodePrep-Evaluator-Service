import { Job, Worker } from "bullmq";

import SampleJob from "../jobs/SampleJob";


export default function SampleWorker(queueName: string){
    new Worker(
        queueName , async(job : Job)=>{
            if(job.name == "SampleJob"){
                const sampleJobInstance = new SampleJob(job.data);

                sampleJobInstance.handle(job);

                //return {
                   // status: 200,
                  //  message: "Job processed successfully"
                //};
            }
        }
    );
}