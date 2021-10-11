const Post = require("../models/post");

exports.getPosts = async(req, res, next) => {
    try {
        const posts = await Post.find().exec();
        if (posts) {
            return res.status(200).json({
                message: "succedded",
                posts: posts,
            });
        } else {
            return res.status(200).json({
                message: "no posts exists",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "fetching posts failed",
        });
    }
};

exports.post = async(req, res, next) => {
    try {
        const post = new Post({
            title: req.body.post.title,
            content: req.body.post.content,
        });
        const createdPost = await post.save();
        return res.status(201).json({
            message: "post created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "post creation failed",
        });
    }
};