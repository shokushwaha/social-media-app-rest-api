const User = require('../models/userModel')

// get user by id
const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        if (!user) {
            throw new Error("user does not exist");
        }
        const { password, __v, role, ...otherInfo } = user._doc;
        res.status(200).send({
            status: "success",
            message: "user info",
            user: otherInfo,
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
};


// get user by username
const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error("user does not exist");
        }
        const { password, __v, role, ...otherInfo } = user._doc;
        res.status(200).send({
            status: "success",
            message: "user info",
            user: otherInfo,
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
};

const getFollowings = async (req, res) => {
    try {
        const username = req.params.username;
        const userfollowings = await User.findOne({ username: username });
        if (!userfollowings) {
            throw new Error("user does not exist");
        }
        const followings = await Promise.all(
            userfollowings.followings.map((following) => {
                return User.findById(following, {
                    username: true,
                    profilePicture: true,
                });
            })
        );
        res.status(200).send({
            status: "success",
            message: "user info",
            followings: followings,
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}

// get all the followers of a user
const getFollowers = async (req, res) => {
    try {
        const username = req.params.username;
        const userfollowers = await User.findOne({ username: username });
        if (!userfollowers) {
            throw new Error("user does not exist");
        }
        const followers = await Promise.all(
            userfollowers.followers.map((follower) => {
                return User.findById(follower, {
                    username: true,
                    profilePicture: true,
                });
            })
        );
        res.status(200).send({
            status: "success",
            message: "user info",
            data: {
                followings: followers,
            },
        });
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}


// follow a user
const followUser = async (req, res) => {
    try {

        const currentUser = await User.findById({ _id: req.user._id });
        if (currentUser.username !== req.params.username) {
            const usertofollow = await User.findOne({
                username: req.params.username,
            });
            if (!usertofollow) {
                throw new Error("user does not exist");
            }
            if (!currentUser.followings.includes(usertofollow._id)) {
                await currentUser.updateOne({
                    $push: { followings: usertofollow._id },
                });
                await usertofollow.updateOne({
                    $push: { followers: currentUser._id },
                });
                res.status(200).send({
                    status: "success",
                    message: "user has been followed",
                });
            } else {
                res.status(400).send({
                    status: "success",
                    message: "you allready follow this user",
                });
            }
        } else {
            throw new Error("you can't follow yourself");
        }
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}
const unfollowUser = async (req, res) => {
    try {
        const currentUser = await User.findById({ _id: req.user._id });
        if (currentUser.username !== req.params.username) {
            const usertounfollow = await User.findOne({
                username: req.params.username,
            });
            if (!usertounfollow) {
                throw new Error("user does not exist");
            }
            if (currentUser.followings.includes(usertounfollow._id)) {
                await currentUser.updateOne({
                    $pull: { followings: usertounfollow._id },
                });
                await usertounfollow.updateOne({
                    $pull: { followers: currentUser._id },
                });
                res.status(200).send({
                    status: "success",
                    message: "user has been unfollowed",
                });
            } else {
                res.status(400).send({
                    status: "success",
                    message: "you don't follow this user",
                });
            }
        } else {
            throw new Error("you can't unfollow yourself");
        }
    } catch (e) {
        res.status(500).send({
            status: "failure",
            message: e.message,
        });
    }
}
module.exports = {
    getUser,
    getUserByUsername,
    getFollowers,
    getFollowings,
    followUser,
    unfollowUser
};
