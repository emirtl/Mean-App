const express = require("express");
const router = express.Router();
const controller = require("../controller/postController");

router.get("/api/getPosts", controller.getPosts);

module.exports = router;