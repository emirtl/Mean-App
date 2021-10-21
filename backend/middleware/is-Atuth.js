const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    console.log(authHeader);
    if (!authHeader) {
        return res.json(401).json({ message: "you are not authorized" });
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    if (!token) {
        return res.json(401).json({ message: "you are not authorized" });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(
            token,
            "GyOBOurZYjHoya1VeJJ3bniL4NRf8U1kENdFR1AhM33gwak2rZsvwoiN16L7XyWzcEYzVaENz0XoZiGRAK28KO2qBIzqOgOCMX0OGnmvJwYtBtAJiO3UoApiLg5JNnQIfdAyrOyWjogCtlEmir"
        );
    } catch (error) {
        return res
            .json(500)
            .json({ message: "you are not authorized or sth went wrong" });
    }
    if (!decodedToken) {
        return res.json(401).json({ message: "you are not authorized" });
    }
    next();
};
