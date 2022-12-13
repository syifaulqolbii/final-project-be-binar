const { Search }= require ('../db/models')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')

module.exports = {
    getData: async (req, res, next) => {
        try {
            // var id = req.params.id
            // let search = await db.sequelize.query(`SELECT "Homes".origin_airport, "Homes".destination_airport, 
            // "Homes".depature_date, "Homes".arrival_date FROM "Homes" JOIN "Searches" 
            // ON "Homes".id = "Searches".home_id WHERE "Homes".id = ${id} ORDER BY "Homes".id ASC `, {
            //     type: QueryTypes.SELECT
            // })
            // const searchOutput = await Search.findOne({ where : {home_id: req.params.id}})
            // if (search.length > 0) {
            //     res.status(200).json({
            //         message: 'Data is Loaded',
            //         searchOutput,
            //         dataHome: search[0]
                    
            //     })
            // } else {
            //     res.status(200).json({
            //         message: 'Data Unknown',
            //         data: []
            //     })
            // }


        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { home_id, airlines, depature_time, arrival_time, duration_time, price } = req.body;

            //Read
            const existSearch = await Search.findOne({ where: {home_id: home_id }});
            if (existSearch){
                return res.status(400).json({
                    status: false,
                    message: 'already create'
                });
            }

            //Create
            const search = await Search.create({
                home_id,
                airlines,
                depature_time,
                arrival_time,
                duration_time,
                price
        
            });


            return res.status(201).json({
                status: true,
                message: 'Succes',
                data: search
            })
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, home_id, airlines, depature_time, arrival_time, duration_time, price } = req.body;

            const existSearch = await Search.findOne({ where: {id: id }});
            if (!existSearch){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const search = await Search.update({
                home_id,
                airlines,
                depature_time,
                arrival_time,
                duration_time,
                price
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: true,
                message: 'Succes',
                data: search
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.params;

            await Search.destroy({
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