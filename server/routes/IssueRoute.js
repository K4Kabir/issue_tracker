const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(bodyParser.json());
const prisma = new PrismaClient();

router.post("/createIssue", async (req, res) => {
  const { title, description, projectId, assignedUsers } = req.body;

  const newIssue = await prisma.issue.create({
    data: {
      title,
      description,
      projectId,
      assignedUsers: {
        connect: assignedUsers.map((userId) => ({ id: userId })),
      },
    },
  });
  if (newIssue) {
    res.status(200).json({ message: newIssue, status: true });
  }
});

router.post("/getIssueByProjectId", async (req, res) => {
  const { projectId } = req.body;

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

  let Issue = [];

  if (user && (user.role == "Admin" || user.role == "Tester")) {
    Issue = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        issues: true,
      },
    });
  } else {
    Issue = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        issues: {
          where: {
            assignedUsers: { some: { id: user.id } },
          },
        },
      },
    });
  }
  if (Issue) {
    res.status(200).json({ message: Issue, success: true });
  }
});

module.exports = router;
