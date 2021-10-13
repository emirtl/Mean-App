const express = require("express");
const router = express.Router();
const controller = require("../controller/postController");

router.get("/getPosts", controller.getPosts);

router.get("/single-post/:postId", controller.singlePost);

router.post("/post", controller.post);

router.post("/post-edit", controller.editPost);

router.delete("/delete-post/:postId", controller.deletePost);

module.exports = router;