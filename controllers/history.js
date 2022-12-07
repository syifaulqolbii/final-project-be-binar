const { History }= require ('../db/models')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')

module.exports = {
    getData: async (req, res, next) => {
        try {
            let history = await db.sequelize.query(`SELECT "Passengers".name_passenger, "Passengers".identity_number, "Passengers".identity_exp_date , 
            "Passengers".nationality, "Passengers".identity_type, "Orders".orderer , "Orders".phone_number, "Orders".email  
            FROM "Passengers" JOIN "Transactions" ON "Passengers".id = "Transactions".passenger_id JOIN "Orders" ON "Orders".id = "Transactions".order_id 
            ORDER BY "Passengers".id ASC `, {
                type: QueryTypes.SELECT
            })
            if (history.length > 0) {
                res.status(200).json({
                    message: 'Data is Loaded',
                    data: history[0]
                })
            } else {
                res.status(200).json({
                    message: 'Data Unknown',
                    data: []
                })
            }

        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { transaction_id, search_id, payment_id, price, status } = req.body;

            //Read
            const existHistory = await History.findOne({ where: {transaction_id: transaction_id }});
            if (existHistory){
                return res.status(400).json({
                    status: false,
                    message: 'already create'
                });
            }

            //Create
            const history = await History.create({
                transaction_id,
                search_id,
                payment_id,
                price,
                status
        
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: history
            })
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, transaction_id, search_id, payment_id, price, status } = req.body;

            const existHistory = await History.findOne({ where: {id: id }});
            if (!existHistory){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const history = await History.update({
                transaction_id,
                search_id,
                payment_id,
                price,
                status
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: history
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await History.destroy({
                where: {
                    id
                }
            });


            return res.status(201).json({
                message: 'Succes Delete Data'
            });
        }catch(err){
            next(err);
        }
    }
}