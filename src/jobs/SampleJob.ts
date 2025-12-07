import { Job } from "bullmq";
import { IJob } from "../types/bullMQJobDefination";

export default class SampleJob implements IJob{
    name: string;
    payload: Record<string, unknown>;
    
    constructor(payload : Record<string, unknown>){
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handle = () => {
        console.log("Handler logic for SampleJob");
    };

    failed = (job? : Job) => {
        console.log("Failed logic for SampleJob");
        if(job){
            console.log(job.id);
        }
    };
}