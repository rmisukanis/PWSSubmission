const router = require("express").Router();

const commentController = require("../controllers/comment.controller");

router.get("/:movie_id", commentController.getCommentsById);
router.post("/:movie_id", commentController.addComment);

module.exports = router;