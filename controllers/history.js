const { History, User, Transaction, Flight, transactionMapping, Passenger }= require ('../db/models')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')
const transaction = require('./transaction')

module.exports = {
    getData: async (req, res, next) => {
        try {
        // const user_id = req.user.id
        const transaction = await Transaction.findAll({where: { UserId : req.user.id},
            include: [{
                model: Flight,
                as: "flight",
                attributes: {exclude: ["createdAt","updatedAt"]}
            }]})
        return res.status(200).json({
            status: true,
            message: 'Display History Data',
            data: transaction
        });

        } catch (err) {
            next(err)
        }
    },
    getDetail: async (req, res, next) => {
        try {
        // const user_id = req.user.id
        const transaction = await Transaction.findAll({where: { UserId : req.user.id},
            include: [{
                model: Flight,
                as: "flight",
                attributes: {exclude: ["createdAt","updatedAt"]}
            }]
        })
        const mapping = await transactionMapping.findAll({where: { UserId: req.user.id},
            include: [{
                model: Passenger,
                as: "passenger",
                attributes: {exclude: ["createdAt","updatedAt"]}
            }]
        })

        const detail = await Promise.all([transaction, mapping])
        
        return res.status(200).json({
            status: true,
            message: 'Display History Detail',
            data: detail
        });

        } catch (err) {
            next(err)
        }
    }
// //     create: async (req, res, next) => {
// //         try {
// //             const { transaction_id, search_id, payment_id, price, status } = req.body;

// //             //Read
// //             const existHistory = await History.findOne({ where: {transaction_id: transaction_id }});
// //             if (existHistory){
// //                 return res.status(400).json({
// //                     status: false,
// //                     message: 'already create'
// //                 });
// //             }

// //             //Create
// //             const history = await History.create({
// //                 transaction_id,
// //                 search_id,
// //                 payment_id,
// //                 price,
// //                 status
        
// //             });


// //             return res.status(201).json({
// //                 status: false,
// //                 message: 'Succes',
// //                 data: history
// //             })
// //         } catch (err) {
// //             next(err)
// //         }
// //     },
// //     update: async (req, res, next) => {
// //         try{
// //             const { id, transaction_id, search_id, payment_id, price, status } = req.body;

// //             const existHistory = await History.findOne({ where: {id: id }});
// //             if (!existHistory){
// //                 return res.status(400).json({
// //                     status: false,
// //                     message: 'data is not found'
// //                 });
// //             }
// //             const history = await History.update({
// //                 transaction_id,
// //                 search_id,
// //                 payment_id,
// //                 price,
// //                 status
        
// //             },
// //             {
// //                 where:{
// //                     id
// //                 }
// //             });


// //             return res.status(201).json({
// //                 status: false,
// //                 message: 'Succes',
// //                 data: history
// //             });
// //         }catch(err){
// //             next(err);
// //         }
// //     },

// //     //Delete
// //     delete: async (req, res, next) => {
// //         try{
// //             const { id } = req.body;

// //             await History.destroy({
// //                 where: {
// //                     id
// //                 }
// //             });


// //             return res.status(201).json({
// //                 message: 'Succes Delete Data'
// //             });
// //         }catch(err){
// //             next(err);
// //         }
// //     }
}