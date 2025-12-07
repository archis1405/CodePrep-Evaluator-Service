import express , { Express } from "express"; 

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/SampleQueueProducer";
import sampleWorker from "./workers/SampleWorker";
import bullBoardAdapter from "./config/bullBoardConfig";

const app:Express = express();

app.use('/api' , apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT , () => {
    console.log(`Server started at ${serverConfig.PORT}`);
    console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

    sampleWorker('SampleQueue');

    sampleQueueProducer('SampleJob', {
        name : "Test by Archisman",
        company: "CodePrep",
        role: "Software Engineer Intern",
        location: "Hyderabad"
    }, 2); // Lower priority job

    sampleQueueProducer('SampleJob', {
        name : "Test by Archisman",
        company: "JPMC",
        role: "SWE Intern",
        location: "BLR"
    }, 1); // Higher priority job --> will use it for Paid leetCode users 
});