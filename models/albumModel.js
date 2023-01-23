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
    artist: [{ type: mongoose.Schema.ObjectId, ref: "artist" }],
    type: String,
  },
  {
    timestamps: true,
  }
);

albumSchema.index({ name: 1 });

albumSchema.pre(/^find/, function (next) {
  this.populate({ path: "section artist" });
  next();
});

const Album = mongoose.model("album", albumSchema);

module.exports = Album;
