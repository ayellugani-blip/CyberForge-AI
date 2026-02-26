const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ msg: "No token provided" });

    const token = authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ msg: "Invalid token format" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // SUPPORT CURRENT TOKEN STRUCTURE
        // login payload:
        // { id, email, name }

        if (!decoded.id)
            return res.status(401).json({ msg: "Invalid token payload" });

        // DO NOT convert to ObjectId
        // keep raw id string
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };

        next();

    } catch (err) {
        console.error("JWT ERROR:", err.message);
        return res.status(401).json({ msg: "Token is not valid" });
    }
};