const { Transaction, Passenger, Order, Flight } = require('../db/models')
const seq = require('sequelize')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')
const transaction = require('../db/models/transaction')
module.exports = {
    getData: async(req, res, next) => {
        try {
            // let transaction = await db.sequelize.query(`SELECT "Passengers".name_passenger, "Passengers".identity_number, "Passengers".identity_exp_date , 
            // "Passengers".nationality, "Passengers".identity_type, "Orders".orderer , "Orders".phone_number, "Orders".email  
            // FROM "Passengers" JOIN "Transactions" ON "Passengers".id = "Transactions".PassengerId JOIN "Orders" ON "Orders".id = "Transactions".OrderId 
            // ORDER BY "Passengers".id ASC `, {
            //     type: QueryTypes.SELECT
            // })
            // if (transaction.length > 0) {
            //     res.status(200).json({
            //         message: 'Data is Loaded',
            //         data: transaction[0]
            //     })
            // } else {
            //     res.status(200).json({
            //         message: 'Data Unknown',
            //         data: []
            //     })
            // }
            Transaction.findOne({where: {id: req.params.id}, 
                include: [
            {
                model: Passenger,
                as: 'passenger',
                attributes: {exclude: ["identity_exp_date","createdAt","updatedAt"]}
            },
            {
                model: Order,
                as: 'order',
                attributes: {exclude: ["createdAt","updatedAt"]} 
            }],
                attributes: {exclude: ["createdAt","updatedAt"]}
            })
            .then(transaction => {
                if(transaction.length < 1) {
                    error
                }
                res.json({message: `Transactions data ${req.params.id} has been found`, success: true, data: {transaction}})
            })
            .catch(err => {
                console.log(err)
                res.json({message: "Transaction is Not Found", success: false, data: {}})  
            })

        } catch (err) {
            next(err)
        }
    },
    getTicket: async( req, res, next) => {
        // const { origin_aiport, destination_aiport, airlines, depature_date, depature_time, price } = req.body
        // console.log(req.params)
        // Flight.findAll()
        // .then((tiket) => {
        //     res.json(tiket)
        // })
        Flight.findOne({ where: {id: +req.params.id}})
        .then((ticket) =>{
            console.log(ticket)
            return res.json({
                data: {
                    ticket, 
                    total: ticket.price * ticket.total_passenger
                }
            })
        })

    },
    create: async (req, res, next) => {
        try {
            const { PassengerId, OrderId } = req.body;

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
                PassengerId,
                OrderId
        
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
            const { id, PassengerId, OrderId } = req.body;

            const existTransaction = await Transaction.findOne({ where: {id: id }});
            if (!existTransaction){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const transaction = await Transaction.update({
                PassengerId,
                OrderId
        
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