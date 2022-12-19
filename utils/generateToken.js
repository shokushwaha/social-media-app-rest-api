const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
    return jwt.sign(
        { username: user.username, role: user.role, _id: user._id },
        'SECRET',
        { expiresIn: "2s" }
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        { username: user.username, role: user.role, _id: user._id },
        'REFRESHSECRET'
    );
};

module.exports = { generateAccessToken, generateRefreshToken };