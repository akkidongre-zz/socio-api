const express = require('express');

const userController = require('../controllers/auth');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/multer-file');

const router = express.Router();

router.post("/socialSignin", userController.socialSignIn);

router.post('/signin', userController.signIn);

router.put('/editAsJson', checkAuth, userController.editAsJson);

router.put('/edit', checkAuth, extractFile, userController.editProfile);

module.exports = router;