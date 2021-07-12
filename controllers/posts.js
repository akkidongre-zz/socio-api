const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            id: createdPost._id,
            message: "Post added successfully"
        });
    }).catch(err => {
        res.status(500).json({
            "message": "Could not create posts"
        });
    });
}

exports.getMyPosts = (req, res, next) => {
    Post.find({creator: req.userData.userId}).then((documents) => {
        const posts = documents.map(post => {
            return {
                id: post._id,
                title: post.title,
                content: post.content
            }
        });
        res.status(200).json({
            message: "Posts fetched successfully",
            posts: posts
        });
    }).catch(err => {
        res.status(500).json({
            error: "Some error occured"
        });
    });
}