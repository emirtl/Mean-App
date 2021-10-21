const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutess");

const path = require("path");

const URl = `mongodb+srv://Emir_Tl:PBs8GX6jNnBHx94B@main-cluster.4mfpi.mongodb.net/X-Violet?retryWrites=true&w=majority`;
// mongosh "mongodb+srv://main-cluster.4mfpi.mongodb.net/myFirstDatabase" --username Emir_Tl

mongoose
    .connect(URl)
    .then(() => {
        console.log("connected");
    })
    .catch((error) => {
        console.log(error);
    });
app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;
