const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const upload = require("../middleware/multer.middleware");
const uploadCloud = require("../utils/Cloudinary");
const jwt = require("jsonwebtoken");

router.use(bodyParser.json());
const prisma = new PrismaClient();

router.post("/save", upload.single("image"), async (req, res) => {
  try {
    const { name, password, assign, description } = req.body;
    console.log(JSON.parse(assign), "ASS");
    const checkProject = await prisma.project.findUnique({
      where: {
        name,
      },
    });
    if (checkProject) {
      res.status(200).json({
        message:
          "The project name is already taken Please choose differenct one!",
        success: false,
      });
    }
    // Upload Image logic
    const image = req.file;
    const response = await uploadCloud.uploadOnCloudinary(image.path);

    if (!response) {
      res.json(400).json({ message: "Error While Connecting to Cloudinary" });
    }

    const newProject = await prisma.project.create({
      data: {
        name: name,
        password: password,
        image: response.url,
        description: description,
        members: {
          create: [...JSON.parse(assign)],
        },
      },
    });

    if (newProject) {
      res.status(200).json({ message: newProject, success: true });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/deleteProject", async (req, res) => {
  const { id } = req.body;
  const deletedProject = await prisma.project.delete({
    where: {
      id,
    },
  });
  if (deletedProject) {
    res.status(200).json({ message: "Deleted Successfully", success: true });
  }
});

router.get("/getAll", async (req, res) => {
  const project = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
    },
  });
  project && res.status(200).json({ message: project, success: true });
});

router.post("/getProjectById", async (req, res) => {
  const { id, password } = req.body;
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
      password: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              role: true,
            },
          },
        },
      },
    },
  });
  const checkPass = await prisma.project.findUnique({
    where: {
      id,
    },
  });
  if (checkPass.password != password) {
    res.status(200).json({ message: "Invalid Password", success: false });
    return;
  }
  if (project) {
    res.status(200).json({ message: project, success: true });
  }
});

// Get assinged projects with the available issues.
router.get("/getAssingedProjects", async (req, res) => {
  const token = req.header("authorization");
  if (!token) {
    res
      .status(200)
      .json({ message: "Please provide the token", success: false });
    return;
  }
  const checkToken = jwt.verify(token, "KABIR");
  if (!checkToken) {
    res.status(200).json({
      message: "JWT token is not valid Please Login again",
      success: false,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: checkToken.data,
    },
  });

  if (!user) {
    res.status(200).json({ message: "User not found", success: false });
  }

  let data = [];

  if (user.role == "Admin" || user.role == "Tester") {
    data = await prisma.projectMembers.findMany({
      where: { userId: user.id },
      include: {
        project: {
          include: {
            issues: true,
          },
        },
      },
    });
  } else {
    data = await prisma.projectMembers.findMany({
      where: { userId: user.id },
      include: {
        project: {
          include: {
            issues: {
              where: { assignedUsers: { some: { id: user.id } } },
            },
          },
        },
      },
    });
  }
  if (data) {
    data.forEach((el) => {
      let issueCount = 0;
      el.project.issues.forEach((i) => {
        if (
          i.status == "PENDING" ||
          i.status == "REOPENED" ||
          i.status == "RESOLVED"
        ) {
          issueCount += 1;
        }
      });
      el.project["count"] = issueCount;
    });
    res.status(200).json({ message: data, success: true });
  }
});

module.exports = router;
