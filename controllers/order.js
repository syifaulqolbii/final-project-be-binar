require('dotenv').config();
const { or } = require('sequelize');
const { Order } = require('../db/models')



module.exports = {
    index: async (req, res, next) => {
        try {
            const order = await Order.findAll();

            return res.status(200).json({
                data: order
            });
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { orderer, phone_number, email } = req.body;

            //Read
            const existOrder = await Order.findOne({ where: {orderer: orderer }});
            if (existOrder){
                return res.status(400).json({
                    status: false,
                    message: 'data already create'
                });
            }

            //Create
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(regex)){
                return res.status(400).json({
                    message: 'email is not valid'
                })
            }

            let re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/g;
            if (!phone_number.match(re)) {
                return res.status(400).json({
                    message: 'phone number is not valid'
                })
            }
            const order = await Order.create({
                orderer,
                phone_number,
                email
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    order: order.order,
                    phone_number: order.phone_number,
                    email: order.email
                }
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, orderer, phone_number, email } = req.body;

            const existOrder = await Order.findOne({ where: {id: id }});
            if (!existOrder){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const order = await Order.update({
                orderer,
                phone_number,
                email
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: order
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Order.destroy({
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