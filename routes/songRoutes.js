const router = require("express").Router();
const songController = require("../controllers/songController");

router
  .route("/")
  .get(songController.getAllSongs)
  .post(songController.createSong);

router.get("/categories", songController.getCategories);

router
  .route("/:id")
  .get(songController.getSong)
  .patch(songController.updateSong)
  .delete(songController.deleteSong);

module.exports = router;
