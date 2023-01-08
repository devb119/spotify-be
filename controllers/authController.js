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

exports.login = async (req, res) => {
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
};

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

exports.updateMe = async function updateMe(req, res, next) {
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
};

exports.getLikedSongs = async function (req, res, next) {
  const likedSongs = await User.findOne({ userId: req.user.userId })
    .select("likedSongs -_id")
    .populate("likedSongs");
  res.status(200).json({ success: true, data: likedSongs });
};

exports.addLikedSongs = async function (req, res) {
  try {
    const options = {
      new: true,
      runValidators: true,
    };
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { likedSongs: req.params.id },
      },
      options
    ).populate("likedSongs", "-lyric -__v -createdAt -updatedAt");
    if (user) {
      res.status(201).json({ success: true, data: user.likedSongs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

exports.deleteLikedSongs = async function (req, res) {
  try {
    const options = {
      new: true,
      runValidators: true,
    };
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { likedSongs: req.params.id },
      },
      options
    ).populate("likedSongs", "-lyric -__v -createdAt -updatedAt");
    if (user) {
      res.status(201).json({ success: true, data: user.likedSongs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
