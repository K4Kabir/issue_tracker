const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const checkUser = await prisma.User.findUnique({
    where: {
      username: username,
    },
  });
  if (!checkUser) {
    res.status(200).json({
      message: "User not found Please register first!",
      success: false,
    });
    return;
  }
  const hasedPass = checkUser.password;
  const check = bcrypt.compareSync(password, hasedPass);
  if (!check) {
    res.status(200).json({ message: "Invalid Password", success: false });
    return;
  }
  const token = jwt.sign(
    {
      data: username,
    },
    "KABIR",
    { expiresIn: "1h" }
  );
  res.status(200).json({ message: token, success: true });
});

router.get("/getUserProfile", async (req, res) => {
  const token = req.header("authorization");
  const checkToken = jwt.verify(token, "KABIR");
  if (!checkToken) {
    res.status(200).json({ message: "Token expired", success: false });
  }
  const user = await prisma.user.findUnique({
    where: {
      username: checkToken.data,
    },
    select: {
      username: true,
      role: true,
      image: true,
      id: true,
    },
  });
  res.status(200).json({ message: user, success: true });
});

router.post("/getAllUsers", async (req, res) => {
  const token = req.header("authorization");
  const checkToken = jwt.verify(token, "KABIR");
  if (!checkToken) {
    res.status(200).json({ message: "Token expired", success: false });
    return;
  }
  const user = await prisma.user.findMany({
    where: {
      username: {
        not: checkToken.data,
      },
    },
    select: {
      username: true,
      role: true,
      image: true,
      id: true,
    },
  });
  res.status(200).json({ message: user, success: true });
});

module.exports = router;
