const User = require('../models/userModel')
const Article = require('../models/articleModel')

const createArticle = async (req, res) => {
    req.body.user = req.user._id;
    const newArticle = new Article(req.body);
    try {
        await newArticle.save();
        res.status(200).send({
            status: "success",
            message: "article uploaded",
        });
    } catch (e) {
        res.status(500).send({
            status: "failed in uplodaing your article",
            message: e.message,
        });
    }
}

const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (req.user._id === article.user.toString() || req.user.role === "admin") {
            await Comment.deleteMany({ user: req.user._id });
            await Article.findByIdAndDelete(req.params.id);
            res.status(200).send({
                status: "success",
                message: "article deleted",
            });
        } else {
            res.status(401).send({
                status: "failure",
                message: "you are not authorized",
            });
        }
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}

const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (req.user._id === article.user.toString()) {
            await Article.updateOne({ $set: req.body });
            res.status(200).send({
                status: "success",
                message: "article updated",
            });
        } else {
            res.status(401).send({
                status: "failure",
                message: "you are not authorized",
            });
        }
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}
const likeUnlike = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article.likes.includes(req.user._id)) {
            await article.updateOne({ $push: { likes: req.user._id } });
            res.status(200).send({
                status: "success",
                message: "article liked",
            });
        } else {
            await article.updateOne({ $pull: { likes: req.user._id } });
            res.status(200).send({
                status: "success",
                message: "article disliked",
            });
        }
    } catch (error) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
};
module.exports = { createArticle, deleteArticle, updateArticle, likeUnlike };