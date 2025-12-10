// import Docker from 'dockerode';
import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';



async function runPython(code: string , inputTestCase: string){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    await pythonDockerContainer.remove();
}

export default runPython;