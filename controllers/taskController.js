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
  const sanitizedTask = { ...newTask };
  delete sanitizedTask.userId;

  return res.status(201).json(sanitizedTask);
}

function index(req, res) {
  const userTasks = global.tasks.filter(
    (task) => task.userId === global.user_id.email)

    if (userTasks.length===0){
      return res.status(404).json({
        message: "no tasks found",
      })
    }
    const sanitizedTasks =userTasks.map((task) =>{
      const sanitizedTask ={...task};
      delete sanitizedTask.userId;
      return sanitizedTask;
    })
    return res.status(200).json(
      sanitizedTasks
    )

}

module.exports = create;
