const express = require("express");
const cors = require("cors");
const server = express();
const { db } = require("./connection/db");
const UserRoutes = require("./routes/UserRoutes");
const ProjectRoute = require("./routes/ProjectRoute");

server.use(cors());

// routes
server.use("/api/User", UserRoutes);

server.use("/api/Project", ProjectRoute);

server.listen(8080, () => {
  console.log("Server Started");
});
