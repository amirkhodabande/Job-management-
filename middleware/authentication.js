const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Please provide authentication token!');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decodedToken.userId,
            userName: decodedToken.name
        };

        next();
    } catch (error) {
        throw new UnauthenticatedError('Unauthorized!');
    }
}

module.exports = auth;