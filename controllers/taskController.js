const taskCounter = (() => {
  let lastTaskNumber = 0;
  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();
// Initializatio
const getNextId = taskCounter();
// Usage
console.log(getNextId()); // 1
