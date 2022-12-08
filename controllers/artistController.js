const Artist = require("../models/artistModel");

exports.getAllArtists = async (req, res, next) => {
  const artists = await Artist.find().sort({ createdAt: -1 });
  if (artists) {
    return res.status(200).json({ success: true, data: artists });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};

exports.createArtist = async (req, res, next) => {
  try {
    const newArtist = await Artist.create({
      name: req.body.name,
      imageURL: req.body.imageURL,
    });
    return res.status(200).json({ success: true, data: newArtist });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.getArtist = async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  if (artist) {
    return res.status(200).json({ success: true, data: artist });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};

exports.updateArtist = async (req, res, next) => {
  const options = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await Artist.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, imageURL: req.body.imageURL },
      options
    );
    return result
      ? res.status(200).json({ data: result })
      : res
          .status(400)
          .json({ success: false, message: "Data not found with that ID" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

exports.deleteArtist = async (req, res, next) => {
  const result = await Artist.findByIdAndDelete(req.params.id);
  if (result) {
    return res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};