const router = require("express").Router();
const sectionController = require("../controllers/sectionController");

router
  .route("/")
  .get(sectionController.getAllSections)
  .post(sectionController.createSection);

module.exports = router;
