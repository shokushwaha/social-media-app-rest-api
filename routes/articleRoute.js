const router = require("express").Router();
const { createArticle, deleteArticle, updateArticle, likeUnlike } = require("../controllers/articleController");
const { verifyAccessToken } = require("../utils/jwtToken");
router.post("/", verifyAccessToken, createArticle);
router.put("/:id", verifyAccessToken, updateArticle);
router.delete("/:id", verifyAccessToken, deleteArticle);
router.get("/:id/like", verifyAccessToken, likeUnlike);

module.exports = router;