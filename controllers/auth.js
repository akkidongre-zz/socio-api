const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const generateToken = (email, id) => {
    return jwt.sign({
        email: email,
        userId: id
    }, 'this_is_supposed_to_be_a_secret', {
        expiresIn: '1h'
    });
}

exports.socialSignIn = async (req, res, next) => {
    try {
        let user = await User.findOne({email: req.body.email});
        console.log(user);

        if (!user) {
            let hash = await bcrypt.hash(req.body.password, 10);
            const userData = new User({
                email: req.body.email,
                password: hash,
                imagePath: req.body.imagePath,
                name: req.body.name
            });
            
            const result = await userData.save();
            const token = generateToken(result.email, result._id);
            res.status(201).json({
                message: "User created",
                token: token,
                expiresIn: req.body.expiresIn,
                bio: '',
                imagePath: result.imagePath,
                name: result.name
            });
        } else {
            bcrypt.compare(req.body.password, user.password).then(result => {
                console.log(result);
                if (!result) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }

                const token = generateToken(user.email, user._id);

                res.status(200).json({
                    message: "Logged in",
                    token: token,
                    expiresIn: req.body.expiresIn,
                    bio: user.bio,
                    imagePath: user.imagePath,
                    name: user.name
                });
            });
        }
    } catch(err) {
        console.log(err);
        res.status(401).json({
            message: "Auth failed"
        });
    }
}

exports.signIn = (req, res, next) => {
    let fetchedUser;
    User.findOne({
        email: req.body.email
    }).then(user => {
        fetchedUser = user;
        if (!user) {
            bcrypt.hash(req.body.password, 10).then(hash => {
                const userData = new User({
                    email: req.body.email,
                    password: hash
                });
                userData.save().then(result => {
                    console.log(result);
                    const token = generateToken(result.email, result._id);
                    res.status(201).json({
                        message: "User created",
                        token: token,
                        expiresIn: 3600,
                        bio: '',
                        imagePath: '',
                        name: ''
                    });
                }).catch(err => {
                    res.status(500).json({
                        message: "Could not sign up"
                    });
                });
            });
        } else {
            bcrypt.compare(req.body.password, user.password).then(result => {
                if (!result) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }

                const token = generateToken(fetchedUser.email, fetchedUser._id);

                res.status(200).json({
                    message: "Logged in",
                    token: token,
                    expiresIn: 3600,
                    bio: fetchedUser.bio,
                    imagePath: fetchedUser.imagePath,
                    name: fetchedUser.name
                });
            })
        }
    }).catch(err => {
        res.status(401).json({
            message: "Auth failed"
        });
    });
    
}

exports.editAsJson = async (req, res, next) => {
    try {
        console.log(req.userData);
        const fetchedUser = await User.findById(req.userData.userId);
        console.log(fetchedUser);
        const user = new User({
            _id: fetchedUser._id,
            name: req.body.name,
            bio: req.body.bio,
            email: fetchedUser.email,
            password: fetchedUser.password,
            imagePath: req.body.imagePath
        });

        const result = await User.updateOne({_id: fetchedUser._id}, user);
        res.status(200).json({
            message: "Updated successfully"
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Could not update profile"
        });
    }
}

exports.editProfile = async (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");

    const fetchedUser = await User.findOne({_id: req.userData.userId});
    const user = new User({
        _id: req.userData.userId,
        name: req.body.name,
        bio: req.body.bio,
        email: fetchedUser.email,
        password: fetchedUser.password,
        imagePath: url + "/images/" + req.file.filename
    });
    console.log(user);
    User.updateOne({_id: req.userData.userId}, user).then(result => {
        console.log(result);
        res.status(200).json({
            "message": "Updated successfully",
            "imagePath": user.imagePath
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            "message": "Could not update"
        });
    });
}