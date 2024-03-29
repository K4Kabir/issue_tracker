const express = require("express");
const cors = require("cors");
const UserRoutes = require("./routes/UserRoutes");
const ProjectRoutes = require("./routes/ProjectRoute");
const IssueRoutes = require("./routes/IssueRoute");
const socketIO = require("socket.io");
const http = require("http");

const server = express();
const s = http.createServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const io = socketIO(s);

// Set up a connection event
let rooms = [];
io.on("connection", (socket) => {
  console.log(`A user connected with room id ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("userLoggedout", (data) => {
    let result = rooms.filter((f) => f !== data);
    rooms = result;
    socket.emit("LoggedOutSuccess", rooms);
  });
});

server.use(cors());

// routes
server.use("/api/User", UserRoutes(io));
server.use("/api/Project", ProjectRoutes);
server.use("/api/Issue", IssueRoutes(io));

s.listen(8080, () => {
  console.log("Server Started");
});
