const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

router.use(bodyParser.json());
const prisma = new PrismaClient();

router.post("/createProject", async (req, res) => {
  try {
    //const { name, password, userId } = req.body;
    // const checkProject = await prisma.project.findUnique({
    //   where: {
    //     name: "Test",
    //   },
    // });
    // if (checkProject) {
    //   res.status(200).json({
    //     message:
    //       "The project name is already taken Please choose differenct one!",
    //     success: false,
    //   });
    // }

    const newProject = await prisma.project.create({
      data: {
        name: "NH Test",
        password: "test_password",
        members: {
          create: [
            {
              userId: 4,
            },
            {
              userId: 5,
            },
          ],
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

router.post("/getProjectById", async (req, res) => {
  const { id } = req.body;
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      image: true,
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
  if (project) {
    res.status(200).json({ message: project, success: true });
  }
});

module.exports = router;
