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
    (task) => task.userId === global.user_id.email,
  );

  if (userTasks.length === 0) {
    return res.status(404).json({
      message: "no tasks found",
    });
  }
  const sanitizedTasks = userTasks.map((task) => {
    const sanitizedTask = { ...task };
    delete sanitizedTask.userId;
    return sanitizedTask;
  });
  return res.status(200).json(sanitizedTasks);
}

function show(req, res) {
  const taskId = parseInt(req.params?.id);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: "id not valid" });
  }
  const task = global.tasks.find(
    (task) => task.id === taskId && task.userId === global.user_id.email,
  );
  if (!task) {
    return res.status(404).json({ message: `no matching task exists` });
  }
  const sanitizedTask = { ...task };
  delete sanitizedTask.userId;

  return res.status(200).json(sanitizedTask);
}
function update(req, res) {
  if (!req.body) req.body = {};
  const { error, value } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.details });
  }
  const idTask = parseInt(req.params?.id);
  if (Number.isNaN(idTask)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = global.tasks.find(
    (task) => task.id === idTask && task.userId === global.user_id.email,
  );
  if (!task) {
    return res.status(404).json({ message: `no matching task` });
  }
  Object.assign(task, value);
  const sanitizedTask = { ...task };
  delete sanitizedTask.userId;

  return res.status(200).json(sanitizedTask);
}
function deleteTask(req, res) {
  const deleteId = parseInt(req.params.id);
  if (isNaN(deleteId)) {
    return res.status(400).json({
      message: `Invalid iD`,
    });
  }
  const index = global.tasks.findIndex(
    (element) =>
      element.id === deleteId && element.userId === global.user_id.email,
  );
  if (index === -1) {
    return res.status(404).json({
      message: ` task not found`,
    });
  }
  const deletedTask = global.tasks.splice(index, 1)[0];

  const sanitizedTask = { ...deletedTask };
  delete sanitizedTask.userId;

  return res.status(200).json(sanitizedTask);
}
module.exports = { create, index, show, update, deleteTask };
