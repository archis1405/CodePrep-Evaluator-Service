// import Docker from 'dockerode';
import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';



async function runCpp(code: string , inputTestCase: string){
   
    const rawLogBuffer: Buffer[] = [];
    console.log("Initializing CPP Container...");

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.cpp && g++ Main.cpp -o Main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./Main`;
    console.log(runCommand);

    
    const cppDockerContainer = await createContainer(CPP_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand
    ])

    await cppDockerContainer.start();

    console.log("Cpp Container started");

    const loggerStream = await cppDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true    
    });

    
    loggerStream.on('data' , (chunk) => {
        rawLogBuffer.push(chunk);
    });

    const response = await new Promise((res) => {
            loggerStream.on('end' , () => {
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodedStream)
        });
    });

    await cppDockerContainer.remove();

    return response
}

export default runCpp;