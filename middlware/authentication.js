const jwt = require("jsonwebtoken");


const requireSignIn = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ msg: "Token not provided" });
        }

        // Check if the token starts with "Bearer "
        if (!token.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Invalid token format" });
        }

        // Remove "Bearer " from the token string
        const jwtToken = token.substring(7).trim();

        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = requireSignIn;
