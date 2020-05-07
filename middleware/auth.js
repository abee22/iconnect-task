const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('../config/app');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({
            message: 'Auth token missing'
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: 'Invalid Token'
            }); 
        }

        req.session = {
            auth: {
                status: true,
                id: decoded.id
            }
        }
        next();
    });
}