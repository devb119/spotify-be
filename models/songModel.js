const mongoose = require("mongoose");

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
      type: mongoose.Schema.ObjectId,
      ref: "artist",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

songSchema.pre(/^find/, function (next) {
  this.populate({
    path: "artist",
    select: "name id",
  });
  next();
});

const Song = mongoose.model("song", songSchema);

module.exports = Song;
