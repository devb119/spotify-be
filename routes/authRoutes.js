const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/login", authController.login);

router.use(authController.protect);
router.route("/updateMe").patch(authController.updateMe);

router.get("/likedSongs", authController.getLikedSongs);

router
  .route("/likedSongs/:id")
  .post(authController.addLikedSongs)
  .delete(authController.deleteLikedSongs);

module.exports = router;
