// import Docker from 'dockerode';
import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import CodeExecutorStratergy, { ExecutionResponse } from '../types/CodeExecutorStratergy';

class JavaExecutor implements CodeExecutorStratergy{

    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse>{
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

        try{
            const codeResponse : string = await this.fetchDecodedStream(loggerStream , rawLogBuffer);
            return {output: codeResponse, status: "COMPLEATED"};
        }
        catch(error){
            return {output: error as string, status: "ERROR"}
        }
        finally{
            await javaDockerContainer.remove();
        }
    }
    
    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]) : Promise<string>{
        return new Promise((res , rej) => {
                loggerStream.on('end' , () => {
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                console.log(decodedStream);
                console.log(decodedStream.stdout);
                    
                if(decodedStream.stderr){
                    rej(decodedStream.stderr);
                }
                else{
                    res(decodedStream.stdout);
                }
            });
        });
    }
}


export default JavaExecutor;