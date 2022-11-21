const Album = require("../models/albumModel");

exports.getAllAlbums = async (req, res, next) => {
  const albums = await Album.find().sort({ createdAt: -1 });
  if (albums) {
    return res.status(200).json({ success: true, data: albums });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};

exports.createAlbum = async (req, res, next) => {
  try {
    const newAlbum = await Album.create({
      name: req.body.name,
      imageURL: req.body.imageURL,
    });
    return res.status(200).json({ success: true, data: newAlbum });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.getAlbum = async (req, res, next) => {
  const album = await Album.findById(req.params.id);
  if (album) {
    return res.status(200).json({ success: true, data: album });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};

exports.updateAlbum = async (req, res, next) => {
  const options = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await Album.findByIdAndUpdate(
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
    return res.status(500).json({ success: false, message: error });
  }
};

exports.deleteAlbum = async (req, res, next) => {
  const result = await Album.findByIdAndDelete(req.params.id);
  if (result) {
    return res
      .status(200)
      .json({ success: true, message: "Data deleted successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};
