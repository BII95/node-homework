const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const taskCounter = (() => {
  let lastTaskNumber = 0;
  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();

function create(req, res) {
  if (!req.body) req.body = {};
  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details });
  }
  const newTask = {
    id: taskCounter(),
    userId: global.user_id.email,
    ...value,
  };
  global.tasks.push(newTask);
  const sanitizedTask  = {...newTask};
  delete sanitizedTask.userId;

  return res.status(201).json(sanitizedTask);
}


module.exports=create