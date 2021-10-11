const express = require("express");
const router = express.Router();
const controller = require("../controller/postController");

router.get("/getPosts", controller.getPosts);

router.post("/post", controller.post);

router.delete("/delete-post/:postId", controller.deletePost);

module.exports = router;