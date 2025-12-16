export default interface CodeExecutorStratergy{
    execute(code: string, inputTestCase: string) : Promise<ExecutionResponse>;
};

export type ExecutionResponse = {output: string, status: string}