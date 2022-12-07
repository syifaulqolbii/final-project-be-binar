require('dotenv').config();
const { Passenger } = require('../db/models')



module.exports = {
    index: async (req, res, next) => {
        try {
            const passenger = await Passenger.findAll();

            return res.status(200).json({
                data: passenger
            });
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { name_passenger, identity_number, identity_exp_date, nationality, identity_type } = req.body;

            //Read
            const existPassenger = await Passenger.findOne({ where: {identity_number: identity_number }});
            if (existPassenger){
                return res.status(400).json({
                    status: false,
                    message: 'data already create'
                });
            }
            let cekIdentity = /^(?=.*[0-9])\d{16}$/
            if (!identity_number.match(cekIdentity)) {
                return res.status(400).json({
                    message: 'Identity mush have 16 character'
                })
            }
            //Create
            const passenger = await Passenger.create({
                name_passenger,
                identity_number, 
                identity_exp_date, 
                nationality, 
                identity_type
        
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    name_passenger: passenger.name_passenger,
                    identity_number: passenger.identity_number,
                    identity_type: passenger.identity_type
                }
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, name_passenger, identity_number, identity_exp_date, nationality, identity_type } = req.body;

            const existPassenger = await Passenger.findOne({ where: {id: id }});
            if (!existPassenger){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const passenger = await Passenger.update({
                name_passenger,
                identity_number, 
                identity_exp_date, 
                nationality, 
                identity_type
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    name_passenger: passenger.name_passenger,
                    identity_number: passenger.identity_number,
                    identity_type: passenger.identity_type
                }
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            const passenger = await Passenger.destroy({
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