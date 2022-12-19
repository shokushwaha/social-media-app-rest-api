const Comment = require("../models/commentModel");
const Article = require("../models/articleModel");

const addComment = async (req, res) => {
    try {
        const { articleId, ...comment } = req.body;
        comment.user = req.user._id;
        const commenttosave = new Comment(comment);
        const savedcomment = await commenttosave.save();
        await Article.findOneAndUpdate(
            { _id: articleId },
            { $push: { comment: savedcomment._id } }
        );
        res.status(200).send({
            status: "success",
            message: "Comment created",
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
};

module.exports = { addComment }