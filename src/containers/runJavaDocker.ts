// import Docker from 'dockerode';
import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';



async function runJava(code: string , inputTestCase: string){
   
    const rawLogBuffer: Buffer[] = [];
    console.log("Initializing Java Container...");

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    console.log(runCommand);

    
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
        '/bin/sh',
        '-c',
        runCommand
    ])
    
    await javaDockerContainer.start();

    console.log("Java Container started");

    const loggerStream = await javaDockerContainer.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
        follow: true    
    });

    
    loggerStream.on('data' , (chunk) => {
        rawLogBuffer.push(chunk);
    });

    await new Promise((res) => {
            loggerStream.on('end' , () => {
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodedStream)
        });
    });

    await javaDockerContainer.remove();
}

export default runJava;