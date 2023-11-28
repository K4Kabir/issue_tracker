const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const middleware = require("../middleware/checkTokenMiddleware");
const upload = require("../middleware/multer.middleware");
const uploadCloud = require("../utils/Cloudinary");
const jwt = require("jsonwebtoken");

router.use(bodyParser.json());

router.use(middleware.checkTokenAuth);

router.post("/save", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;
    const response = await uploadCloud.uploadOnCloudinary(image.path);
    if (!response) {
      res.json(400).json({ message: "Error While Connecting to Cloudinary" });
    }
    const { name, description, assign } = req.body;
    const createdProject = await Project.create({
      name: name,
      description: description,
      image: response.url,
      assign: assign,
    });
    if (createdProject) {
      res.status(200).json({ message: "Created Successfully", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const AllProjects = await Project.find();
    if (AllProjects) {
      res.status(200).json({ message: AllProjects, success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/deleteProject", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedRecord = await Project.deleteOne({ _id: id });

    if (deletedRecord) {
      res.status(200).json({ message: "Deleted Successfully", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAssingedProjects", async (req, res) => {
  try {
    const token = req.headers.authorization;
    var decoded = jwt.verify(token, "KABIR");

    if (decoded) {
      let allProjects = await Project.find();

      let seperated = [];

      console.log(decoded.id);

      allProjects.forEach((el) => {
        if (JSON.parse(el.assign).includes(decoded.id)) {
          seperated.push(el);
        }
      });

      res.status(200).json({ message: seperated, success: true });
    } else {
      res
        .status(400)
        .json({ message: "Cannot get your Assinged Projects", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
