// import Docker from 'dockerode';
import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import CodeExecutorStratergy, { ExecutionResponse } from '../types/CodeExecutorStratergy';

class CppExecutor implements CodeExecutorStratergy{

    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse>{
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

        try{
            const codeResponse : string = await this.fetchDecodedStream(loggerStream , rawLogBuffer);
            return {output: codeResponse, status: "COMPLEATED"};
        }
        catch(error){
            return {output: error as string, status: "ERROR"}
        }
        finally{
            await cppDockerContainer.remove();
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


export default CppExecutor;