const express = require("express");
const router = express.Router();
const Genre = require("../models/genreModel");

router.post("/", async function (req, res, next) {
  try {
    const genre = await Genre.create({
      name: req.body.name,
      imageURL: req.body.imageURL,
    });
    res.status(200).json({
      success: true,
      data: genre,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err });
  }
});

module.exports = router;
