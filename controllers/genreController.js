const Genre = require("../models/genreModel");

exports.getAllGenres = async function (req, res, next) {
  const genres = await Genre.find();
  if (genres) {
    res.status(200).json({ success: true, data: genres });
  } else {
    res.status(400).send({ success: false, message: "Data not found" });
  }
};

exports.createGenre = async function (req, res, next) {
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
};
