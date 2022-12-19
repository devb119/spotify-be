const router = require("express").Router();
const Section = require("../models/sectionModel");

router.post("/", async function (req, res, next) {
  try {
    const section = await Section.create({
      genre: req.body.genre,
      name: req.body.name,
    });
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
});

module.exports = router;
