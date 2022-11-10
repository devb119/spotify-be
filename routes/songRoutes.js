const router = require("express").Router();
const songController = require("../controllers/songController");

router.get("/", songController.getAllSongs);

module.exports = router;
