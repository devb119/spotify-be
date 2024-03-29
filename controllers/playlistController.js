const Playlist = require("../models/playlistModel");

exports.getAllPlaylists = async function (req, res, next) {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    if (queryObj.name) {
      queryObj.name = { $regex: queryObj.name, $options: "i" };
    }
    const playlists = await Playlist.find({
      ...queryObj,
      isAutoGenerated: true,
    });
    if (playlists) {
      res.status(200).json({ success: true, data: playlists });
    } else {
      res.status(400).send({ success: false, message: "Data not found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

exports.createPlaylist = async function (req, res) {
  try {
    const playlist = await Playlist.create({
      name: req.body.name,
      description: req.body.description,
      imageURL: req.body.imageURL,
      songs: req.body.songs,
      creator: req.body.creator,
      section: req.body.section,
      isAutoGenerated: req.body.isAutoGenerated,
    });
    return res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.getAllMyPlaylists = async function (req, res, next) {
  const myPlaylists = await Playlist.find({ creator: req.user._id }).select();
  res.status(200).json({ success: true, data: myPlaylists });
};

exports.getMyPlaylist = async function (req, res) {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      creator: req.user._id,
    });
    if (playlist) {
      res.status(200).json({ success: true, data: playlist });
    } else {
      res.status(400).json({ success: false, message: "No data found" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

exports.createMyPlaylist = async function (req, res, next) {
  try {
    const newPlaylist = await Playlist.create({
      name: req.body.name,
      songs: req.body.songs ? req.body.songs : [],
      creator: req.user._id,
      description: req.body.description,
      imageURL: req.body.imageURL,
    });
    if (newPlaylist) {
      res.status(200).json({ success: true, data: newPlaylist });
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.updateMyPlaylist = async function (req, res) {
  const options = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await Playlist.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        description: req.body.description,
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

exports.addSongToPlaylist = async function (req, res, next) {
  try {
    const options = {
      new: true,
      runValidators: true,
    };
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.playlist,
      {
        $push: { songs: req.params.song },
      },
      options
    );
    if (playlist) {
      res.status(200).json({ success: true, data: playlist });
    } else {
      res.status(401).json({ success: false, message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

exports.deleteSongFromPlaylist = async function (req, res, next) {
  try {
    const options = {
      new: true,
      runValidators: true,
    };
    const playlist = await Playlist.findByIdAndUpdate(
      req.params.playlist,
      {
        $pull: { songs: req.params.song },
      },
      options
    );
    if (playlist) {
      res.status(200).json({ success: true, data: playlist });
    } else {
      res.status(401).json({ success: false, message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

exports.deleteMyPlaylist = async function (req, res) {
  try {
    const playlist = await Playlist.findOneAndDelete({
      creator: req.user._id,
      _id: req.params.id,
    });
    if (playlist) {
      res.status(204).json({ success: true, data: playlist });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No document found with that ID" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
