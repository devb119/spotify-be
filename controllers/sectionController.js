const Section = require("../models/sectionModel");
const Genre = require("../models/genreModel");

exports.getAllSections = async function (req, res, next) {
  try {
    if (!req.query.genre) {
      const sections = await Section.find();
      return res.status(200).send({ success: true, data: sections });
    }

    const sections = await Section.find({ genre: req.query.genre });
    if (sections) {
      res.status(200).json({ success: true, data: sections });
    } else {
      res
        .status(400)
        .section({ success: false, message: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

exports.createSection = async function (req, res, next) {
  try {
    const section = await Section.create({
      genre: req.body.genre,
      name: req.body.name,
    });
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
