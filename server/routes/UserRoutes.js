const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

router.use(bodyParser.json());

const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  const checkUser = await prisma.User.findUnique({
    where: {
      username: username,
    },
  });
  if (checkUser) {
    res.status(200).json({ message: "User already present !", success: false });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(password, salt);
  const newUser = await prisma.User.create({
    data: {
      username,
      password: hashedPass,
      role,
    },
  });
  if (newUser) {
    res.status(200).json({ message: newUser, success: true });
  }
});

module.exports = router;
