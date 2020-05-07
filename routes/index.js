const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/auth');

const userController = require('../controllers/user');

router.get(
    '/ping',
    (req, res, next) => {
        res.status(200).json({
            message: 'ping successfully',
            release_note: 'project init'
        });
    }
);
router.post(
    '/signup',
    userController.validate('signup'),
    userController.signUp
);
router.post(
    '/login',
    userController.validate('login'),
    userController.login
);
router.get(
    '/me',
    authMiddleWare,
    userController.getMyData
);

module.exports = router;
