const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

// signup
const signup = async (req, res) => {
    try {
        const data = req.body;
        const { username, password, email } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createduser = new User({
            username: username,
            password: hashedPassword,
            email: email,
        });
        const saveuser = await createduser.save();
        res.status(200).send({
            status: "success",
            message: "user saved successfully",
            data: {
                user: username,
            },
        })
    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}

// login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(401).send({
                status: "failure",
                message: "user does not exist",
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({
                status: "failure",
                message: "password is incorrect",
            });
        }
        const accessToken = generateToken.generateAccessToken(user);
        const refreshToken = generateToken.generateRefreshToken(user);
        await User.findByIdAndUpdate(user._id, {
            jwtToken: refreshToken,
        });
        const { jwtToken, password: newpass, ...other } = user._doc;
        res.cookie('access-token', refreshToken, {
            httpOnly: true,
            expiresIn: '60*10'
        });
        res.status(200).send({
            status: "success",
            message: "logged in successfully",
            data: other,
            accessToken,
            refreshToken,
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}


// logout
const logout = (req, res) => {
    try {

        res.clearCookie('access-token');
        res.send({ message: `Logged Out` })
    } catch (error) {
        res.status(400).send({ message: err });
    }
}

module.exports = { signup, login, logout }