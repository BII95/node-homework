# Node.js Fundamentals

## What is Node.js?

Node.js is a runtime environment using Javascript. It allows you to write back-end code without having to leaarn a new programming language. In other words, Node.js gives you control over things beyond the front-end that are not limited to the browser window. Node.js also has access to thousands of npm packages to build server-side applications.

## How does Node.js differ from running JavaScript in the browser?
Node.js runs on the server, from the terminal. Because JavaScript runs in the browser, it has acess to window and the DOM. This does not work in Node because it does not control the webpage. Node gives you acess to backend tools instead. 

## What is the V8 engine, and how does Node use it?

The V8 engine is the program that reads JavaScript and turns it into instructions that the computer runs. It is the same thing that runs Google Chrome browser but repurposed.So,the V8 engine can be used to execute  back-end instructions and operate the window for a web app. 
## What are some key use cases for Node.js?
Node.js can do the following:
    -Read and write files.
    -Start a web server.
    Read environment variables.
    -Work with operating system services.
    -Use backend libraries like Express.

Node is useful because it unleashes JavaScript further and does not limit it to the window. Therefore, things like cross-app communication, task automation, and scripts are possible. 

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

Node.js imports and exports code using syntax different from Javascript and React. The function require() is called synchronously. It is also cached. ES modules use static asynchronous loading. ES modules use import/ export syntax. 

**CommonJS (default in Node.js):**
import example

```js
    const { register, logoff } = require("../controllers/userController");`

export example

```function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };```

**ES Modules (supported in modern Node.js):**
```js
import { useState, useEffect } from "react";

export default function Hello(){
    console.log('hello world')
}
``` 