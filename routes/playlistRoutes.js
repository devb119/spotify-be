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

router
  .route("/me/:id")
  .get(playlistController.getMyPlaylist)
  .patch(playlistController.updateMyPlaylist)
  .delete(playlistController.deleteMyPlaylist);

router
  .route("/:playlist/:song")
  .post(playlistController.addSongToPlaylist)
  .delete(playlistController.deleteSongFromPlaylist);

module.exports = router;
