const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

router.use(bodyParser.json());
const prisma = new PrismaClient();

router.post("/createIssue", async (req, res) => {
  const assignedUserIds = [4, 5];
  const newIssue = await prisma.issue.create({
    data: {
      title: "Sample Issue3",
      description: "Description of the issue2",
      projectId: 14, // Replace with the actual project ID
      assignedUsers: {
        connect: assignedUserIds.map((userId) => ({ id: userId })),
      },
    },
  });
  if (newIssue) {
    res.status(200).json({ message: newIssue, status: true });
  }
});

module.exports = router;
