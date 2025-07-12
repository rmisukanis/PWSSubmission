const router = require("express").Router();

const ratingController = require("../controllers/rating.controller");

router.post("/:movieId", ratingController.addRating);

module.exports = router;