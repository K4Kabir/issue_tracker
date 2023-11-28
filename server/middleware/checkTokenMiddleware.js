const jwt = require("jsonwebtoken");

module.exports = {
  checkTokenAuth: function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(400).json({ message: "No Token Provided" });
      return;
    }
    var decoded = jwt.verify(token, "KABIR");
    if (decoded) {
      next();
    } else {
      res.status(400).json({ message: "Invalid Token" });
    }
  },
};
