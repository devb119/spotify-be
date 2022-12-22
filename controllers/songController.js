const Song = require("../models/songModel");

exports.getAllSongs = async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  if (queryObj.name) {
    queryObj.name = { $regex: queryObj.name, $options: "i" };
  }

  const query = Song.find({
    ...queryObj,
  });

  const songs = await query;

  if (songs) {
    return res.status(200).json({ success: true, data: songs });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const songs = await Song.distinct("category");
    res.status(200).json({ success: true, data: songs });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.createSong = async (req, res, next) => {
  try {
    const newSong = await Song.create({
      name: req.body.name,
      imageURL: req.body.imageURL,
      songURL: req.body.songURL,
      album: req.body.album,
      artist: req.body.artist,
      language: req.body.language,
      lyric: req.body.lyric,
      section: req.body.section,
      duration: req.body.duration,
      countListen: req.body.countListen,
    });
    return res.status(200).json({ success: true, data: newSong });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (song) {
      return res.status(200).json({ success: true, data: song });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Data not found" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.updateSong = async (req, res, next) => {
  const options = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await Song.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songURL: req.body.songURL,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        section: req.body.section,
        lyric: req.body.lyric,
        duration: req.body.duration,
        countListen: req.body.countListen,
      },
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

exports.deleteSong = async (req, res, next) => {
  try {
    const result = await Song.findByIdAndDelete(req.params.id);
    console.log(result);
    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Data deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Data not found" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};
