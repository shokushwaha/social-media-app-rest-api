const User = require('../models/userModel')

// get user by id
const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        // searching the user by url-id
        const user = await User.findOne({ _id: id });
        // if user does not exist
        if (!user) {
            throw new Error("user does not exist");
        }
        // if user exist then send the data 
        const { password, role, ...otherInfo } = user._doc;
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
        // searching the user by url-username
        const user = await User.findOne({ username: username });
        // if user does not exist 
        if (!user) {
            throw new Error("user does not exist");
        }
        // sending the data
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

// get all the following of a user -> 
const getFollowings = async (req, res) => {
    try {
        const username = req.params.username;
        // searching the user by url-username
        const userfollowings = await User.findOne({ username: username });
        // if username does not present in db then return with error
        if (!userfollowings) {
            throw new Error("user does not exist");
        }
        // if username is present then map over the followings array of user-schema and return all the users who are following the requested user
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
        // searching the user by url-username
        const userfollowers = await User.findOne({ username: username });
        // if username does not exist then return with error
        if (!userfollowers) {
            throw new Error("user does not exist");
        }
        // if username exists then map over the followers array of user schema and return all the users present in followers array
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

        // storing the current user  
        const currentUser = await User.findById({ _id: req.user._id });
        // if current user's username is not equal to url-user's username then process further else return with error
        if (currentUser.username !== req.params.username) {
            const usertofollow = await User.findOne({
                username: req.params.username,
            });
            if (!usertofollow) {
                throw new Error("user does not exist");
            }
            // if current user's followings array does not contain url-user's id then add it in its followings list
            if (!currentUser.followings.includes(usertofollow._id)) {
                // searching the user which current user have to follow
                // add url-user to current user followings array
                await currentUser.updateOne({
                    $push: { followings: usertofollow._id },
                });
                // add current user to url-users's followers id
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
        // storing the current user 
        const currentUser = await User.findById({ _id: req.user._id });
        // if current user's username is not equal to url-user's username then proceed further
        if (currentUser.username !== req.params.username) {
            // searching the user which current user have to unfollow
            const usertounfollow = await User.findOne({
                username: req.params.username,
            });
            if (!usertounfollow) {
                throw new Error("user does not exist");
            }
            // remove the url-user from current user followings array
            if (currentUser.followings.includes(usertounfollow._id)) {
                await currentUser.updateOne({
                    $pull: { followings: usertounfollow._id },
                });
                // remove current user from url-user followers array
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
