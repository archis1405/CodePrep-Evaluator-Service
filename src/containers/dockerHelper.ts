import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer) : DockerStreamOutput {
    // Keeps a track of the current position of the buffer while parsing
    let offset = 0;

    // The output that will store the accumulated stdout and stderr output as a strings
    const output: DockerStreamOutput = {
        stdout: '',
        stderr: ''
    };

    // Loop until offset reaches the end of the buffer
    while(offset < buffer.length){
        //channel is read from buffer and has a value of the type of stream
        const channel = buffer[offset]; 

        //As now we have read the header , we can now move forward with the value of the chunk 
        offset += DOCKER_STREAM_HEADER_SIZE;

        // The length variable holds the length of the value
        // we will read this variable on a offset of 4 bytes from the start of the chunk
        const length = buffer.readUInt32BE(offset + 4); 

        if(channel == 1){
            // Output Stream
            output.stdout += buffer.toString('utf-8' , offset , offset + length);
        }
        else if(channel == 2){
            // Error Stream
            output.stderr += buffer.toString('utf-8' , offset , offset + length);
        }

        offset += length; // Move the offset forward by the length of the chunk
    }

    return output;
}