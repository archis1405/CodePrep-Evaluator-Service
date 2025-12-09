import Docker from 'dockerode';

async function createContainer(imageName: string, cmdExecutable: string[]){
    const docker = new Docker();

    // Check if image exists locally
    const images = await docker.listImages({
        filters: { reference: [imageName] }
    });

    // Pull image if it doesn't exist
    if (images.length === 0) {
        console.log(`Image ${imageName} not found locally. Pulling...`);
        
        await new Promise((resolve, reject) => {
            docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
                if (err) return reject(err);
                
                docker.modem.followProgress(
                    stream, 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err: Error | null, output: any) => {
                        if (err) return reject(err);
                        console.log(`Successfully pulled ${imageName}`);
                        resolve(output);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (event: any) => {
                        // Optional: log progress
                        if (event.status) {
                            console.log(`${event.status} ${event.progress || ''}`);
                        }
                    }
                );
            });
        });
    } else {
        console.log(`Image ${imageName} found locally`);
    }

    // Now create the container
    const container = await docker.createContainer({
        Image: imageName,
        Cmd : cmdExecutable,
        AttachStdin: true,      // to enable input streams
        AttachStdout: true,     // to enable output streams
        AttachStderr: true,     // to enable error streams
        Tty: false,
        OpenStdin: true,        // keep the input stream open even when theres no interaction
    });

    return container;
}

export default createContainer;