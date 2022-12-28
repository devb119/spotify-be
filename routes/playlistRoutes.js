const router = require("express").Router();
const authController = require("../controllers/authController");
const playlistController = require("../controllers/playlistController");

router
  .route("/")
  .get(playlistController.getAllPlaylists)
  .post(playlistController.createPlaylist);

// From this point => protected
router.use(authController.protect);

router
  .route("/me")
  .get(playlistController.getAllMyPlaylists)
  .post(playlistController.createMyPlaylist);

module.exports = router;
