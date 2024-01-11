const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

router.use(bodyParser.json());
const prisma = new PrismaClient();

router.post("/createIssue", async (req, res) => {
  const { title, description, projectId, assignedUsers } = req.body;
  const assignedUserIds = [4, 5];

  const newIssue = await prisma.issue.create({
    data: {
      title,
      description,
      projectId,
      assignedUsers: {
        connect: assignedUserIds.map((userId) => ({ id: userId })),
      },
    },
  });
  if (newIssue) {
    res.status(200).json({ message: newIssue, status: true });
  }
});

//router.post("/updateIssue", async (req, res) => {});

module.exports = router;
