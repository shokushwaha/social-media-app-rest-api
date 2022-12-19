const router = require("express").Router();

const { signup, login, logout, confidential } = require('../controllers/authController');
const { getUser, getUserByUsername, getFollowers, getFollowings, followUser, unfollowUser } = require('../controllers/userController')
const { verifyAccessToken } = require("../utils/jwtToken");




router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
// test for working of jwt
router.get('/confidential', verifyAccessToken, confidential);
router.get("/:id", getUser);
router.get("/:username", getUserByUsername);
router.get("/followings/:username", getFollowings);
router.get("/followers/:username", getFollowers);
router.put("/:username/follow", verifyAccessToken, followUser);
router.put("/:username/unfollow", verifyAccessToken, unfollowUser);


module.exports = router;