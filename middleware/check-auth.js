const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'this_is_supposed_to_be_a_secret');
        console.log(decodedToken);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        }
        next();
    } catch(error) {
        res.status(401).json({
            message: "Auth failed"
        });
    }
    
}