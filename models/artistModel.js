const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

artistSchema.index({ name: 1 });

const Artist = mongoose.model("artist", artistSchema);

module.exports = Artist;
