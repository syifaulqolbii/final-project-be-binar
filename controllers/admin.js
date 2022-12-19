const { User, Transaction, Flight  } = require('../db/models');

module.exports = {
    getUser : async (req, res, next)=>{
        try {
            const user = await User.findAll();

            return res.status(200).json({
                status: true,
                data: user
            });
        } catch (err) {
            next(err)
        }
    },
    getTransaction : async (req, res, next)=>{
        try {
            const transaction = await Transaction.findAll();

            return res.status(200).json({
                status: true,
                data: transaction
            });
        } catch (err) {
            next(err)
        }
    },
    getRoute : async (req, res, next)=>{
        try {
            const route = await Flight.findAll();

            return res.status(200).json({
                status: true,
                data: route
            });
        } catch (error) {
            next(err)
        }
    }
}