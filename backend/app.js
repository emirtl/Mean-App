const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRouter = require("./routes/postRoutes");

const URl = `mongodb+srv://Emir_Tl:PBs8GX6jNnBHx94B@main-cluster.4mfpi.mongodb.net/X-Violet?retryWrites=true&w=majority`;

app.use(postRouter);

mongoose
    .connect(URl)
    .then(() => {
        console.log("connected");
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app;