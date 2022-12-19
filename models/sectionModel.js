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

sectionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "genre",
    select: "name",
  });
  next();
});

const Section = mongoose.model("section", sectionSchema);

module.exports = Section;
