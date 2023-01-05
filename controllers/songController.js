const Section = require("../models/sectionModel");
const Song = require("../models/songModel");
const Artist = require("../models/artistModel");

exports.getAllSongs = async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  if (queryObj.name) {
    queryObj.name = { $regex: queryObj.name, $options: "i" };
  }

  const query = Song.find(queryObj);

  const songs = await query;

  if (songs) {
    return res.status(200).json({ success: true, data: songs });
  } else {
    return res.status(400).json({ success: false, message: "Data not found" });
  }
};

exports.getSongsWithSections = async function (req, res, next) {
  const result = await Song.aggregate([
    {
      $group: {
        _id: "$section",
        count: { $sum: 1 },
        songs: {
          $push: {
            _id: "$_id",
            name: "$name",
            imageURL: "$imageURL",
            artist: "$artist",
          },
        },
      },
    },
    { $project: { _id: 0 } },
  ]);
  const resultPromises = result.map(async (el) => {
    const section = await Section.findById(el._id).select("-_id -genre -__v");
    const newSongs = el.songs.map(async (song) => {
      let artist;
      if (Array.isArray(song.artist)) {
        const artistPromises = song.artist.map(
          async (id) =>
            await Artist.findById(id).select("-createdAt -__v -updatedAt")
        );
        artist = await Promise.all(artistPromises);
      } else {
        artist = [
          await Artist.findById(song.artist).select(
            "-createdAt -__v -updatedAt"
          ),
        ];
      }
      return { ...song, artist };
    });
    const songsResult = await Promise.all(newSongs);
    return { ...el, section, songs: songsResult };
  });
  const populatedResult = await Promise.all(resultPromises);

  res.status(200).json({ success: true, data: populatedResult });
};

exports.getSongsBySection = async function (req, res) {
  try {
    const songs = await Song.find({ section: req.params.id });
    if (songs) {
      return res.status(200).json({ success: true, data: songs });
    } else {
      return res.status(400).json({ success: false, message: "No data found" });
    }
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
