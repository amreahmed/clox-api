const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const token = cookies?.token;
    if (!token) next();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken?.id) {
      const targetUser = await User.findOne({ id: decodedToken.id });
      if (targetUser) {
        req.user = targetUser;
      }
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
