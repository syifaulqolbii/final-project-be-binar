const { Transaction } = require('../db/models')
const { Passenger } = require('../db/models')
const seq = require('sequelize')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')
module.exports = {
    getData: async(req, res, next) => {
        try {
            let transaction = await db.sequelize.query(`SELECT "Passengers".name_passenger, "Passengers".identity_number, "Passengers".identity_exp_date , 
            "Passengers".nationality, "Passengers".identity_type, "Orders".orderer , "Orders".phone_number, "Orders".email  
            FROM "Passengers" JOIN "Transactions" ON "Passengers".id = "Transactions".passenger_id JOIN "Orders" ON "Orders".id = "Transactions".order_id 
            ORDER BY "Passengers".id ASC `, {
                type: QueryTypes.SELECT
            })
            if (transaction.length > 0) {
                res.status(200).json({
                    message: 'Data is Loaded',
                    data: transaction[0]
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
            const { passenger_id, order_id } = req.body;

            //Read
            // const existTransaction = await Transaction.findOne({ where: {id: id }});
            // if (existTransaction){
            //     return res.status(400).json({
            //         status: false,
            //         message: 'data already create'
            //     });
            // }
            //Create
            const transaction = await Transaction.create({
                passenger_id,
                order_id
        
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    transaction
                }
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, passenger_id, order_id } = req.body;

            const existTransaction = await Transaction.findOne({ where: {id: id }});
            if (!existTransaction){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const transaction = await Transaction.update({
                passenger_id,
                order_id
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: transaction
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Transaction.destroy({
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