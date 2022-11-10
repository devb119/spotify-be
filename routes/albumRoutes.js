const router = require("express").Router();

router.get("/", async (req, res) => {
  return res.json("getting all albums");
});

module.exports = router;
