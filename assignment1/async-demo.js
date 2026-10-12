const fs = require("fs");
const path = require("path");

// Write a sample file for demonstration
const dirPath = path.join(__dirname,"sample-files");
const samplePath = path.join(dirPath, "sample.txt");

function setUp(){
  fs.mkdirSync(dirPath,{recursive: true});
  fs.writeFileSync(samplePath,"Hello, async world!")

}

// 1. Callback style

function callbackStyle(callback){
  fs.readFile(samplePath,"utf8",(error,data)=>{
    if(error){
      console.error("Callback error:",error.message);
      return callback(error)
    
    }
    console.log(`Callback: ${data}`)
    callback(null)
  })
}
// Callback hell example (test and leave it in comments):
//This is when async operations that depend on each others completion have logic nested.This causes the code to drift and error handling has to be implemented at every level. It makes code hars to read and debug. 


// fs.writeFile(samplePath, "Hello, async world!", (error) => {
//   if (error) {
//     console.error(error);
//     return;
//   } 
//     fs.readFile(samplePath, "utf8",(error, data) => {
//       if (error) {
//         console.error(error);
//         return;
//       }
//         console.log(data);
//     });
//   
// });


// 2. Promise style

function promiseStyle(){
  return new Promise((resolve,reject) =>{
    fs.readFile(samplePath,'utf8',(error,data) =>{
      if (error) reject(error);
      else resolve(data);
    })
  })
}

// 3. Async/Await style
async function asyncStyle(){
  try{
    const data = await promiseStyle()
    console.log(`Async/await: ${data}`);
  }catch (error){
    console.error('Async/await error:',error.message)
  }
}

function main() {
  setUp();
  callbackStyle(() =>{
    promiseStyle()
      .then((data) =>{
        console.log(`Promise: ${data}`);
      })
    .catch ((error)=>{
      console.error('promise error:',error.message)
    })
    .finally(() =>{
      asyncStyle();
    })
  });

}

main();