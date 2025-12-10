import express , { Express } from "express"; 
import bodyParser from "body-parser";

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
// import sampleQueueProducer from "./producers/SampleQueueProducer";
import sampleWorker from "./workers/SampleWorker";
import bullBoardAdapter from "./config/bullBoardConfig";
import SubmissionWorker from "./workers/SubmissionWorker";
import { submission_Queue } from "./utils/constants";
//import runPython from "./containers/runPythonDocker";
//import runJava from "./containers/runJavaDocker";
//import runCpp from "./containers/runCpp";

import SubmissionQueueProducer from "./producers/SubmissionQueueProducer";

const app:Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/api' , apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT , () => {
    console.log(`Server started at ${serverConfig.PORT}`);
    console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

    sampleWorker('SampleQueue');
    SubmissionWorker(submission_Queue);

    const userCode = `
        class Solution {
        public:
            vector<int> premute(){
            vector<int> v;
            v.push_back(1);
            v.push_back(2);
            return v;
        }
    };
    `;

    const code = `
        #include <iostream>
        #include <vector>
        #include<stdio.h>
        using namespace std;

        ${userCode}

        int main(){
            Solution s;
            vector<int> result = s.premute();
            for(int x : result){
                cout << x << " ";
            }
            cout << endl;
            return 0;
        }
    `;

    const inputCase = `10`;

    SubmissionQueueProducer({
        "1234": {
            language: "CPP",
            inputCase,
            code
        }
    });

    

    /* sampleQueueProducer('SampleJob', {
        name : "Test by Archisman",
        company: "CodePrep",
        role: "Software Engineer Intern",
        location: "Hyderabad"
    }, 2); // Lower priority job

    sampleQueueProducer('SampleJob', {
        name : "Test by Archisman",
        company: "JPMC",
        role: "SWE Intern",
        location: "BLR"
    }, 1); // Higher priority job --> will use it for Paid leetCode users 
    

    //const code = "print(input())";
    const code = ` x = input()
y = input()
print("value of x is" , x)
print("value of y is" , y)
`;

    const code = ` 
    import java.util.*;
        public class Main {
            public static void main(String[] args) {
                Scanner sc = new Scanner(System.in);
                int a = sc.nextInt();
                System.out.println("Input received: " + a);
                for (int i = 0; i < 5; i++) {
                    System.out.println("Value of a is: " + a);
                }
            }
        }
`;


    const code = `
    #include <iostream>
    using namespace std;
    
    int main() {
        int a;
        cin >> a;
        cout << "Input received: " << a << endl;
        for (int i = 0; i < 5; i++) {
            cout << "Value of a is: " << a << endl;
        }
        return 0;
    }
    `

    const inputCase = `100`;

    // runPython(code, inputCase);
    //runJava(code, inputCase);
    runCpp(code, inputCase);
*/
});