const { User, Transaction, Flight  } = require('../db/models');

module.exports = {
    getUser : async (req, res, next)=>{
        try {
            const user = await User.findAll();
            const jumlah = user.length

            return res.status(200).json({
                status: true,
                data: jumlah
            });
        } catch (err) {
            next(err)
        }
    },
    getTransaction : async (req, res, next)=>{
        try {
            const transaction = await Transaction.findAll();
            const jumlah = transaction.length

            return res.status(200).json({
                status: true,
                data: jumlah
            });
        } catch (err) {
            next(err)
        }
    },
    getRoute : async (req, res, next)=>{
        try {
            const route = await Flight.findAll();
            const jumlah = route.length

            return res.status(200).json({
                status: true,
                data: jumlah
            });
        } catch (error) {
            next(err)
        }
    }
}