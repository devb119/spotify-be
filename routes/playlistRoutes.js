const router = require("express").Router();
const authController = require("../controllers/authController");
const playlistController = require("../controllers/playlistController");

router
  .route("/")
  .get(playlistController.getAllPlaylists)
  .post(playlistController.createPlaylist);

module.exports = router;
