const Post = require("../models/post");

exports.getPosts = async(req, res, next) => {
    const pageIndex = +req.query.pageIndex || 1;
    const pageSize = +req.query.pageSize || 3;

    try {
        const totalPostItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .skip((pageIndex - 1) * pageSize)
            .limit(pageSize);
        if (posts) {
            return res.status(200).json({
                message: "succedded",
                posts: posts,
                totalPostItems: totalPostItems,
            });
        } else {
            return res.status(404).json({
                message: "no posts exists",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "fetching posts failed",
        });
    }
};

exports.singlePost = async(req, res, next) => {
    const postId = req.params.postId;
    if (!postId) {
        return res.status(500).json({
            message: "sth went wrong. please try later",
        });
    }
    try {
        const post = await Post.findById(postId).exec();
        return res.status(200).json({
            message: "fetching single post succeded",
            post: post,
        });
    } catch (error) {
        return res.status(500).json({
            message: "fetching post failed",
        });
    }
};

exports.post = async(req, res, next) => {
    try {
        const path = req.protocol + "://" + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image: path + "/images/" + req.file.filename,
        });
        const createdPost = await post.save();

        return res.status(201).json({
            message: "post created successfully",
            image: createdPost.image,
        });
    } catch (error) {
        return res.status(500).json({
            message: "post creation failed",
        });
    }
};

exports.editPost = async(req, res, next) => {
    const postId = req.params.postId;
    let image = req.body.image;

    if (!postId) {
        return res.status(500).json({
            message: "editing post failed.please try later",
        });
    }

    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        image = url + "/images/" + req.file.filename;
    }

    try {
        const post = await Post.findOne({ _id: postId }).exec();
        if (!post) {
            return res.status(500).json({
                message: "editing post failed.please try later",
            });
        } else {
            post.title = req.body.title;
            post.content = req.body.content;
            post.image = image;
            await post.save();
            return res.status(200).json({
                message: "editing post succeded",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "editing post failed.",
        });
    }
};

exports.deletePost = async(req, res, next) => {
    const postId = req.params.postId;
    console.log(postId);
    if (!postId) {
        return res.status(500).json({
            message: "sth went wrong. please try later",
        });
    }
    try {
        await Post.findByIdAndRemove(postId);
        return res.status(200).json({
            message: "post deletion succeeded",
        });
    } catch (error) {
        return res.status(500).json({
            message: "post deletion failed",
        });
    }
};
