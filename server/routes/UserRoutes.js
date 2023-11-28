const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.use(bodyParser.json());

router.post("/createUser", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const alreadyExist = await User.findOne({ email });

    if (alreadyExist) {
      res.status(200).json({ message: "User already Exists", success: false });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const createdUser = User.create({
      email: email,
      password: hash,
      role: role,
    });

    if (createdUser) {
      res.status(200).json({ message: "User Created", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const checkUser = await User.findOne({ email: email });

  if (!checkUser) {
    res
      .status(200)
      .json({ message: "User not found! Please Register", success: false });
    return;
  }

  bcrypt.compare(password, checkUser.password, function (err, check) {
    if (check == true) {
      const token = jwt.sign(
        { email: email, id: checkUser.id, role: checkUser.role },
        "KABIR",
        {
          expiresIn: "24h",
        }
      );
      res.cookie("token", token, { httpOnly: true });
      res
        .status(200)
        .json({ message: "Login Successfull", success: true, token: token });
    } else {
      res.status(200).json({ message: "Invalid Credentials", success: false });
    }
  });
});

router.get("/getUserProfile", async (req, res) => {
  const token = req.headers.authorization;
  var decoded = jwt.verify(token, "KABIR");

  if (decoded) {
    res.status(200).json({ message: decoded, success: true });
  } else {
    res.status(400).json({ message: "Invalid Token", success: true });
  }
});

router.post("/getAllUsers", async (req, res) => {
  const token = req.headers.authorization;
  var decoded = jwt.verify(token, "KABIR");
  let users = await User.find();
  const filteredUser = users.filter((el) => {
    return el.email != decoded.email;
  });
  if (filteredUser) {
    res.status(200).json({ message: filteredUser, success: true });
  } else {
    res.status(200).json({ message: [], success: false });
  }
});

module.exports = router;
