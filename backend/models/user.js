const mongoose = require("mongoose");
const uniqueValidatior = require("mongoose-unique-validator");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
userSchema.plugin(uniqueValidatior);
module.exports = mongoose.model("User", userSchema);
