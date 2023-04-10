const jwt = require('jsonwebtoken');
require('dotenv').config();

const rdToken = process.env.RANDOM_TOKEN_SECRET;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, rdToken);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({error});
    }
};