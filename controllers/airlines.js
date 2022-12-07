const { Airline } = require('../db/models')

module.exports = {
    index: async (req, res, next) => {
        try {
            const airline = await Airline.findAll();

            return res.status(200).json({
                data: airline
            });
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { code, airline_name } = req.body;

            //Read
            const existAirline = await Airline.findOne({ where: {code: code }});
            if (existAirline){
                return res.status(400).json({
                    status: false,
                    message: 'data already create'
                });
            }

            //Create
            const airline = await Airline.create({
                code,
                airline_name
        
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    code: airline.code,
                    airline_name: airline.airline_name
                }
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { code, airline_name } = req.body;

            const existAirline = await Airline.findOne({ where: {id: id }});
            if (!existAirline){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const airline = await Airline.update({
                code,
                airline_name
        
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
                    code: airline.code,
                    airline_name: airline.airline_name
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

            const airline = await Airline.destroy({
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