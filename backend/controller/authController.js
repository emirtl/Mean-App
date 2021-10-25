const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const existingUser = await UserModel.findOne({ email: email }).exec();
        if (existingUser) {
            return res.status(401).json({
                message: "user with thease credentials already exists",
            });
        } else {
            const hash = await bcrypt.hash(password, 12);
            if (!hash) {
                return res.status(400).json({
                    message: "sth went wrong please try again",
                });
            }
            const user = new UserModel({
                email: email,
                password: hash,
            });
            const createdUser = await user.save();
            return res.status(201).json({ message: "user created successfully" });
        }
    } catch (error) {
        return res.status(500).json({ message: "sth went wrong please try again" });
    }
};
exports.login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const existingUser = await UserModel.findOne({ email: email }).exec();
        if (!existingUser) {
            return res
                .status(401)
                .json({ message: "user with thease credentials doenst exists" });
        } else {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: "user with thease credentials doenst exists" });
            }
            const token = await jwt.sign({ userId: existingUser._id, email: existingUser.email },
                "GyOBOurZYjHoya1VeJJ3bniL4NRf8U1kENdFR1AhM33gwak2rZsvwoiN16L7XyWzcEYzVaENz0XoZiGRAK28KO2qBIzqOgOCMX0OGnmvJwYtBtAJiO3UoApiLg5JNnQIfdAyrOyWjogCtlEmir", { expiresIn: "1h" }
            );
            return res.status(200).json({
                message: "logged in successfully",
                token: token,
                expiresIn: 3600,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "sth went wrong please try again" });
    }
};