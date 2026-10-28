const express = require("express");
const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.post("/testpost", (req, res) => {
//   res.status(200).json({
//     message: "POST route works",
//   });
// });

global.user_id= null
global.users = []
global.tasks =[]


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

const timeRouter = require("./routes/timeRoutes");
const userRouter = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")
const notFound = require("./middleware/not-found")
const errorHandler = require("./middleware/error-handler")

app.use("/api",timeRouter);
app.use("/api/users",userRouter);
app.use("/api/tasks",taskRoutes)
app.use(notFound);
app.use(errorHandler);

module.exports = { app, server };
