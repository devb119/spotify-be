const mongoose = require("mongoose");
const checkEmptyArray = require("../utils/checkEmptyArray");

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    songURL: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    artist: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "artist",
          required: true,
        },
      ],
      validate: [checkEmptyArray, "An artist is required"],
    },
    language: {
      type: String,
      required: true,
    },
    lyric: String,
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    countListen: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

songSchema.index({ name: 1 });

songSchema.pre(/^find/, function (next) {
  this.populate({
    path: "artist section",
    select: "name id genre imageURL",
  });
  next();
});

const Song = mongoose.model("song", songSchema);

module.exports = Song;
