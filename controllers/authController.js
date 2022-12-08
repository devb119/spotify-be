const admin = require("../config/firebase.config");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ message: "You are not logged in! Please login to get access" });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res
        .status(401)
        .send({ message: "You are not logged in! Please login to get access" });
    } else {
      const user = await User.findOne({ userId: decodeValue.user_id });
      if (!user) {
        return res
          .status(401)
          .send({ message: "User has been deleted or no longer exist" });
      }
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(501).json({ success: false, message: error });
  }
};
