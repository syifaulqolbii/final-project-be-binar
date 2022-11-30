const jwt = require('jsonwebtoken');
const roles = require('../utils/roles');

const {
    JWT_SECRET_KEY
} = process.env

module.exports = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ status: false, message: 'you\'re not authorized!' });
        }

        const payload = jwt.verify(token, JWT_SECRET_KEY);
        req.user = payload;

        if (roles.length > 0 && !roles.includes(payload.role)) {
            return res.status(401).json({ status: false, message: 'you\'re not authorized!' });
        }

        next();
    };

        // cekLogin: (req, res, next) =>{
    //     try {
    //         const token = req.headers['authorization'];
    //         if (!token) {
    //             return res.status(401).json({
    //                 status: false,
    //                 message: 'you are not authorize!',
    //                 data: null
    //             });
    //         }

    //         const decode = jwt.verify(token, JWT_SECRET_KEY);
    //         req.user = decode;

    //         next();
    //    } catch(err){
    //         if (err.message == 'jwt malformed') {
    //             return res.status(401).json({
    //                 status: false,
    //                 message: err.message,
    //                 data: null
    //             });
    //         }

    //         next(err)

    //     }
    // }   
};