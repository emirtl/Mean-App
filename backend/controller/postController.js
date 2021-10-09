exports.getPosts = (req, res, next) => {
    res.json({
        message: "succedded",
        posts: [{
                id: "qweqweq",
                title: "title from database",
                content: "from database content",
            },
            {
                id: "qweqasdasdweq",
                title: "title from database2",
                content: "from database content2",
            },
        ],
    });
};