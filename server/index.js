const express = require("express");
const cors = require("cors");
const UserRoutes = require("./routes/UserRoutes");
const ProjectRoutes = require("./routes/ProjectRoute");

const server = express();

server.use(cors());

// routes
server.use("/api/User", UserRoutes);
server.use("/api/Project", ProjectRoutes);

server.listen(8080, () => {
  console.log("Server Started");
});
