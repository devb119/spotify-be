const Artist = require("../models/artistModel");
const Song = require("../models/songModel");
const Album = require("../models/albumModel");

exports.getAllArtists = async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  if (queryObj.name) {
    queryObj.name = { $regex: queryObj.name, $options: "i" };
  }

  const artists = await Artist.find(queryObj);
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
  try {
    const artist = await Artist.findById(req.params.id)
      .select("-updatedAt -createdAt -__v")
      .lean();
    artist.popularTracks = await Song.find({ artist: artist._id })
      .select("-lyric -updatedAt -sectionName")
      .sort({
        countListen: -1,
      })
      .limit(10);
    const popularAlbums = await Album.find({ artist: artist._id })
      .limit(5)
      .lean();
    artist.popularAlbums = await Promise.all(
      popularAlbums.map(async (album) => {
        const songs = await Song.find({ album: album._id }).select(
          "-album -lyric -section -artist"
        );
        return { ...album, songs };
      })
    );
    if (artist) {
      return res.status(200).json({ success: true, data: artist });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Data not found" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
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
