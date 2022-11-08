const express = require("express");
const app = express();
// Backend code require dotenv to read environment variable
require("dotenv/config");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/auth");

// Handle cors error
app.use(cors({ origin: true }));

app.get("/", (req, res, next) => {
  return res.json("Hi there!");
});

// User authentication route
app.use("/api/users", userRoute);

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
