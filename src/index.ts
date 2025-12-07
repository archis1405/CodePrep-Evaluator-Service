import express , { Express } from "express"; 

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducer from "./producers/SampleQueueProducer";
import sampleWorker from "./workers/SampleWorker";

const app:Express = express();

app.use('/api' , apiRouter);

app.listen(serverConfig.PORT , () => {
    console.log(`Server started at ${serverConfig.PORT}`);

    sampleWorker('SampleQueue');

    sampleQueueProducer('SampleJob', {
        name : "Test by Archisman",
        company: "CodePrep",
        role: "Software Engineer Intern",
        location: "Hyderabad"
    });
});