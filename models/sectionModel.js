const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  genre: {
    type: mongoose.Schema.ObjectId,
    ref: "genre",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Section = mongoose.model("section", sectionSchema);

module.exports = Section;
