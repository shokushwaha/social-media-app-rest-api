const router = require("express").Router();

const { signup, login, logout, confidential } = require('../controllers/authController');
const { verifyAccessToken } = require("../utils/jwtToken");



router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.get('/confidential', verifyAccessToken, confidential);
module.exports = router;