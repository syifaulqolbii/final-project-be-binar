const { User, Transaction  } = require('../db/models');

module.exports = {
    getUser : async (req, res, next)=>{
        try {
            const user = await User.findAll();
            const jumlah = user.length

            return res.status(200).json({
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
                data: jumlah
            });
        } catch (err) {
            next(err)
        }
    }
}