const express = require("express");
const admin = require("../config/firebase.config");
const auth = require("../controllers/authController");
const User = require("../models/userModel");

const router = express.Router();

router.get("/login", async (req, res) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({ message: "You are not logged in! Please login to get access" });
  }

  const token = req.headers.authorization.split(" ")[1];
  // decode token
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res
        .status(401)
        .json({ message: "You are not logged in! Please login to get access" });
    } else {
      // Checking user exists or not
      const userExists = await User.findOne({ userId: decodeValue.user_id });
      if (!userExists) {
        // await User.create()
        createNewUser(decodeValue, req, res);
      } else {
        updateUser(decodeValue, req, res);
      }
    }
  } catch (error) {
    return res.status(501).json({ message: error });
  }
});

const createNewUser = async (decodeValue, req, res) => {
  const newUser = {
    name: decodeValue.name,
    email: decodeValue.email,
    imageURL: decodeValue.picture,
    userId: decodeValue.user_id,
    emailVerified: decodeValue.email_verified,
    role: "member",
    authTime: decodeValue.auth_time,
    likedSongs: [],
  };

  try {
    const savedUser = await User.create(newUser);
    res.status(200).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(501).send({ success: false, message: error });
  }
};

const updateUser = async (decodeValue, req, res) => {
  const filter = { userId: decodeValue.user_id };

  const option = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await User.findOneAndUpdate(
      filter,
      {
        authTime: decodeValue.auth_time,
        ...req.body,
      },
      option
    );
    result
      ? res.status(200).json({ data: result })
      : res
          .status(400)
          .json({ success: false, message: "Data not found with that ID" });
  } catch (error) {
    return res.status(501).json({ success: false, message: error });
  }
};

async function updateMe(req, res, next) {
  const user = await User.findOneAndUpdate(
    { userId: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  user
    ? res.status(200).json({ data: user })
    : res
        .status(400)
        .json({ success: false, message: "Data not found with that ID" });
}

router.route("/updateMe").patch(auth.protect, updateMe);

router.get("/likedSongs", auth.protect, async function (req, res, next) {
  const likedSongs = await User.findOne({ userId: req.user.userId })
    .select("likedSongs -_id")
    .populate("likedSongs");
  res.status(200).json({ success: true, data: likedSongs });
});

module.exports = router;
