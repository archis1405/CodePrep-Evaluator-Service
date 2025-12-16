// import Docker from 'dockerode';
import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import CodeExecutorStratergy, { ExecutionResponse } from '../types/CodeExecutorStratergy';
//import DockerStreamOutput from '../types/dockerStreamOutput';

class PythonExecutor implements CodeExecutorStratergy{

    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        const rawLogBuffer: Buffer[] = [];
        console.log("Initializing Python Container...");

        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
        console.log(runCommand);

        //const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['echo', code, '>test.py && echo' , inputTestCase , '|' , 'python3 test.py' ]);
        const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
            '/bin/sh',
            '-c',
            runCommand
        ])
        //Starting or booting the corresponding container
        await pythonDockerContainer.start();

        console.log("Python Container started");

        const loggerStream = await pythonDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true   // weather the logs are returned as String or not 
        });

        //Attach Events on this Stream object so that we can start and stop Streaming
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
            await pythonDockerContainer.remove();
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


export default PythonExecutor;