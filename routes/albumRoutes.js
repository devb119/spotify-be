const router = require("express").Router();
const albumController = require("../controllers/albumController");

router
  .route("/")
  .get(albumController.getAllAlbums)
  .post(albumController.createAlbum);

router
  .route("/:id")
  .get(albumController.getAlbum)
  .patch(albumController.updateAlbum)
  .delete(albumController.deleteAlbum);

module.exports = router;
