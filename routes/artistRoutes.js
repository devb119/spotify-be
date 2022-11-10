const router = require("express").Router();
const Artist = require("../models/artistModel");
const artistController = require("../controllers/artistController");

router
  .route("/")
  .get(artistController.getAllArtists)
  .post(artistController.createArtist);

router
  .route("/:id")
  .get(artistController.getArtist)
  .patch(artistController.updateArtist)
  .delete(artistController.deleteArtist);

module.exports = router;
