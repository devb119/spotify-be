const router = require("express").Router();
const albumController = require("../controllers/albumController");

router.get("/", albumController.getAllAlbums);

module.exports = router;
