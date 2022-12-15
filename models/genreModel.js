const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

const Genre = mongoose.model("genre", genreSchema);

module.exports = Genre;
