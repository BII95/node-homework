const os = require('os');
const path = require('path');
const fs = require('fs');

const sampleFilesDir = path.join(__dirname, 'sample-files');
if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

// OS module

console.log(`Platform: ${os.platform()}`)
console.log(`CPU Model:${os.cpus()[0].model}`);
console.log(`Total memory: ${os.totalmem()}`);

// Path module
const pathToFile = path.join(sampleFilesDir,'file.txt')
console.log(`Joined path: ${pathToFile}`)
// fs.promises API
async function modFile() {
  const content = 'Hello from fs.promises!'
 try {
   await fs.promises.writeFile(pathToFile, content, "utf8");
   const data = await fs.promises.readFile(pathToFile, "utf8");
   console.log(`fs.promises read: ${data}`);
 } catch (error) {
   console.error("Write error:", error.message);
 }
}
modFile();

// Streams for large files- log first 40 chars of each chunk
