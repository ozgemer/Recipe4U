const express = require("express");
const bodyParser = require("body-parser");
const recipeRouter = require("./routers/recipe-router");
const bookmarkRouter = require("./routers/bookmark-router");
const usersRouter = require("./routers/users-router");
const HttpError = require("./models/httpError");
const mongoose = require("mongoose");

// ************************ chat requires *************************
var cors = require("cors");
var chat = require("./models/chat");
var socketio = require("socket.io");
var http = require("http");
// ****************************************************************
const app = express();
var server = http.createServer(app);
var io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
chat(io);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //every port can send
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE"); //type of http rew
  next();
});

app.use("/users", usersRouter);
app.use("/recipe", recipeRouter);
app.use("/bookmark", bookmarkRouter);
app.use(cors());
app.use((req, res, next) => {
  const error = new HttpError("Cold  not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://noyflaysher:noyflaysher7@cluster0.2rxt4ia.mongodb.net/mern?retryWrites=true&w=majority"
  )
  .then(() => {
    server.listen(3000, () => console.log("listen to port 3000"));
  })
  .catch((err) => console.log(err));
