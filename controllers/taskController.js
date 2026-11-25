const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");
const prisma = require("../db/prisma")

async function create(req, res) {
  if (!req.body) req.body = {};
  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.details });
  }
const task = await prisma.task.create({
  data: {
    title: value.title,
    isCompleted: value.isCompleted,
    priority:value.priority,
    userId: global.user_id,
  },
  select: {
    title: true,
    isCompleted: true,
    id: true,
    priority: true,
  },
});
  
  return res.status(201).json(task);
}

async function index(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereClause = { userId: global.user_id }; // only this user's tasks
  if (req.query.find) {
    whereClause.title = {
      contains: req.query.find,
      mode: "insensitive",
    };
  }



  const tasks = await prisma.task.findMany({
    where: {
      userId: global.user_id, // only the tasks for this user!
    },
    select: {
      id: true,
      title: true,
      isCompleted: true,
      priority: true,
      createdAt: true,
      User: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    skip: skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  const totalTasks = await prisma.task.count({
    where: { userId: global.user_id },
  });
  const pagination = {
    page: page,
    limit: limit,
    total: totalTasks,
    pages: Math.ceil(totalTasks / limit),
    hasNext: page * limit < totalTasks,
    hasPrev: page > 1,
  };

  if (tasks.length === 0) {
    return res.status(404).json({ message: "no tasks found" });
  }

  return res.status(200).json({
    tasks,
    pagination,
  });
}

async function show(req, res) {
  const taskId = parseInt(req.params?.id);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: "id not valid" });
  }

  const task= await prisma.task.findUnique({where:{id:taskId,userId:global.user_id},
  select:{title:true,isCompleted:true,id:true},})
  if (!task){
    return res.status(404).json({message:"no matching task exists"})
  }
  return res.status(200).json(task);
}

async function update(req, res,next) {
  if (!req.body) req.body = {};
  const { error, value } = patchTaskSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.details });
  }

  const taskId = parseInt(req.params?.id);
  if (Number.isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

   if (Object.keys(value).length === 0) {
     return res.status(400).json({ message: "no fields to update" });
   }

  try {
    const task = await prisma.task.update({
      data: value,
      where: {
        id:taskId,
        userId: global.user_id,
      },
      select: { title: true, isCompleted: true, id: true },
    });        
    return res.status(200).json(task);

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "The task was not found." });
    } else {
      return next(err); // pass other errors to the global error handler
    }
  }
}

async function deleteTask(req, res,next) {
  const taskId = parseInt(req.params?.id);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  try{
    const task = await prisma.task.delete({
      where:{id:taskId,userId:global.user_id},
      select:{title:true,isCompleted:true,id:true},
    });
    return res.status(200).json(task);
  } catch(err){
    if (err.code==="P2025"){
      return res.status(404).json({message:"The task was not found"})
    }
    return next(err);
  }
}

module.exports = { create, index, show, update, deleteTask };
