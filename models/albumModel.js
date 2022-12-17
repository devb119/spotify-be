const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
    },
    type: String,
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model("album", albumSchema);

module.exports = Album;
