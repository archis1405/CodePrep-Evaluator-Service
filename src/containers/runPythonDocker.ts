// import Docker from 'dockerode';

import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';


async function runPython(code: string){
    const pythonContainer = await createContainer(PYTHON_IMAGE, ['python3' , '-c' , code , 'stty -echo']);

    return pythonContainer;
}

export default runPython;