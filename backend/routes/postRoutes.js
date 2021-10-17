const express = require("express");
const router = express.Router();
const controller = require("../controller/postController");

const multer = require("multer");

const MIME_TYPE = {
    "image/jpg": "jpg",
    "image/png": "png",
    "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("file format is not an image");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    },
});

router.get("/getPosts", controller.getPosts);

router.get("/single-post/:postId", controller.singlePost);

router.post(
    "/post",
    multer({ storage: storage }).single("image"),
    controller.post
);

router.post(
    "/post-edit/:postId",
    multer({ storage: storage }).single("image"),
    controller.editPost
);

router.delete("/delete-post/:postId", controller.deletePost);

module.exports = router;