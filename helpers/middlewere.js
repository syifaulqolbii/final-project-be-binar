const jwt = require('jsonwebtoken');

const {
    JWT_SECRET_KEY
} = process.env

module.exports = {
    cekLogin: (req, res, next) =>{
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'you are not authorize!',
                    data: null
                });
            }

            const decode = jwt.verify(token, JWT_SECRET_KEY);
            req.user = decode;

            next();
       } catch(err){
            if (err.message == 'jwt malformed') {
                return res.status(401).json({
                    status: false,
                    message: err.message,
                    data: null
                });
            }

            next(err)

        }
    }   
}
