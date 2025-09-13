const express = require("express");
const LikeController = require("../controllers/likeController");

const router = express.Router();

router.post("/create", LikeController.create);

router.delete("/delete", LikeController.delete);

router.get("/user/:user_id", LikeController.getUserLikes);

module.exports = router;
