const express = require("express");
const app = express();
// Backend code require dotenv to read environment variable
require("dotenv/config");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/authRoutes");
const artistRoutes = require("./routes/artistRoutes");
const songRoutes = require("./routes/songRoutes");
const albumRoutes = require("./routes/albumRoutes");

// Handle cors error
app.use(cors({ origin: true }));

app.get("/", (req, res, next) => {
  return res.json("Hi there!");
});

// User authentication route
app.use("/api/users", userRoutes);

// Artist Routes
app.use("/api/artists", artistRoutes);

// Album Routes
app.use("/api/albums", albumRoutes);

// Song Routes
app.use("/api/songs", songRoutes);

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
