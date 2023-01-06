const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/login", authController.login);

router
  .route("/updateMe")
  .patch(authController.protect, authController.updateMe);

router.get("/likedSongs", authController.protect, authController.getLikedSongs);

module.exports = router;
