const express = require("express");
// Backend code require dotenv to read environment variable
require("dotenv/config");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/authRoutes");
const artistRoutes = require("./routes/artistRoutes");
const songRoutes = require("./routes/songRoutes");
const albumRoutes = require("./routes/albumRoutes");
const genreRoutes = require("./routes/genreRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

// Handle cors error
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json("Hi there!");
});

// User authentication route
app.use("/api/users", userRoutes);

// Artist Routes
app.use("/api/artists", artistRoutes);

// Album Routes
app.use("/api/albums", albumRoutes);

// playlist Routes
app.use("/api/playlists", playlistRoutes);

// Song Routes
app.use("/api/songs", songRoutes);

// Genre Routes
app.use("/api/genres", genreRoutes);

// Section Routes
app.use("/api/sections", sectionRoutes);

// DB connection
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("DB connected!"))
  .on("error", (error) => {
    console.log(`ERROR: ${error}`);
  });

app.listen(4000, () => console.log("Listening on port 4000..."));

module.exports = app;
