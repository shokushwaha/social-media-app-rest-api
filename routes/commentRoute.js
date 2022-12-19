const router = require("express").Router();

const { addComment } = require("../controllers/commentController");
const { verifyAccessToken } = require("../utils/jwtToken");

router.post("/", verifyAccessToken, addComment);
module.exports = router;