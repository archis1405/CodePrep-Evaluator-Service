## Steps to setup a new TypeScript+Express Project

1.     
```
npm init -y
```
2. 
```
npm install -D typescript
npm install concurrently      --> helps to run multiple packages at the same time 
npm i dotenv
npm i bullmq                  --> Redis doesnot have support for typescript
npm i ioredis                 --> Redis doesnot have support for typescript so we have install types manually 
npm i @types/ioredis
npm i dockerode
```
3. 
```
npx tsc --init
```
4. 
```
Add the following Scripts in the package.json

    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\"  " --> runs both the scripts concurrently 
```

5. 
```
Make these config changes in tsconfig.json

"noUnusedLocals": true, 
"strict": true,                                    /* Enable all strict type-checking options. */
"noImplicitAny": true,                             /* Enable error reporting for expressions and declarations with an implied 'any' type. */
"strictNullChecks": true,                          /* When type checking, take into account 'null' and 'undefined'. */
"strictFunctionTypes": true, 

"forceConsistentCasingInFileNames": true, 
"esModuleInterop": true,

"target": "es2016",
"module": "commonjs",
"outDir": "./dist",

"skipLibCheck": true  

"exclude": ["node_modules"],
"include": ["src/**/*.ts"]
```


6. 
```
npm run dev
```


# BULL BOARD 
```
npm i @bull-board/ui
Link --> https://github.com/felixmosh/bull-board
```
