const {body, validationResult} = require('express-validator');
var md5 = require('md5');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const secret = require('../config/app');

exports.validate = method => {
    switch (method) {
        case 'login': {
            return [
                body('username').exists().not().isEmpty(),
                body('password').exists().not().isEmpty(),
            ];
        }

        case 'signup': {
            return [
                body('full_name').exists().not().isEmpty(),
                body('mobile').exists().not().isEmpty().matches(/^[1-9]\d{9}$/),
                body('username').exists().not().isEmpty(),
                body('password').exists().not().isEmpty(),
            ];
        }
    }
};

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Validation failed',
        });
        return;
    }

    const { full_name, mobile, username, password } = req.body;

    getUser(username).then(user => {
        if (user && user.mobile) {
            res.status(409).json({
                message: 'User already exist',
            });
            return;
        }

        const data = {
            full_name,
            mobile,
            username,
            password: md5(password)
        };

        addUser(data).then(() => {
            res.status(201).json({
                full_name,
                mobile,
                username
            });
        }).catch(err => {
            res.status(err.code || 500).json(
                {
                    message: err.message || 'Oops! Something went wrong.',
                }
            );
        })
    });
}

const addUser = data => {
    return new Promise((resolve, reject) => {
        let user = new User(data);
        user.save(err => {
            if (err) {
                reject({code: 500, message: err});
                return;
            }
            resolve();
        });
    });
}

const getUser = username => {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }, (err, docs) => {
            if (err) {
                return resolve({});
            }

            return resolve(docs);
        });
    });
}

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'Validation failed',
        });
        return;
    }

    const { username, password } = req.body;

    User.findOne({ username, password: md5(password) }, (err, docs) => {
        if (err) {
            res.status(401).json({
                message: 'Authorization failed',
            });
            return;
        }

        if (!docs) {
            res.status(401).json({
                message: 'Authorization failed',
            });
            return;
        }
        const { _id, full_name, mobile, username } = docs;
        
        const token = jwt.sign({ id: _id }, secret, {expiresIn: '24h'})

        res.status(200).json({
            full_name,
            mobile,
            username,
            token
        });
    });
}

exports.getMyData = (req, res, next) => {
    const id = req.session.auth.id;
    User.findOne({ _id: id }, (err, docs) => {
        if (err) {
            res.status(404).json({
                message: 'Not Found',
            });
            return;
        }

        if (!docs) {
            res.status(404).json({
                message: 'Not Found',
            });
            return;
        }
        const { _id, full_name, mobile, username } = docs;

        res.status(200).json({
            full_name,
            mobile,
            username
        });
    });
};