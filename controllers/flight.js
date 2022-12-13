const { Flight, User, Search, Sequelize }= require ('../db/models')
const db  = require('../db/models/index')
const { QueryTypes, or } = require('sequelize')
const user = require('../db/models/user');
// const { query } = require('express');
// const { query } = require('express')
const Op = Sequelize.Op;

module.exports = {
    getSearch: async (req, res, next) => {
        try {

            // let tab = 1
            // let oa = ''
            // let da = ''
            // let dd = ''
            // let rd = ''
            // let tp = ''
            // if(req.query.tab){
            //     tab = req.query.tab
            // }
            // if(req.query.oa){
            //     oa = req.query.oa
            // }
            // if(req.query.da){
            //     da = req.query.da
            // }
            // if(req.query.dd){
            //     dd = req.query.dd
            // }
            // if(req.query.rd){
            //     rd = req.query.rd
            // }
            // if(req.query.tp){
            //     tp = req.query.tp
            // }
            // console.log(req.query)
            // let offset = (tab-1)*4
            // Flight.findAll({where :{
            //     origin_airport : oa,
            //     destination_airport : da,
            //     depature_date: dd,
            //     return_date: rd,
            //     total_passenger: tp,
            //     airlines,
            //     depature_time,
            //     arrival_time,
            //     price
            // },
            // limit: 4,
            // offset
            // })
            // .then(home =>{
            //     if(home.length == 0){
            //         res.json({message: "Flight is not found", succes: true, data: {home}})
            //     }else{
            //         res.json({message: "Found Flight", succes: true, data: {

            //         }})
            //     }
            // })
            const {oa, da, dd, rd, tp} = req.query
            req.query.where = {
                [Op.and]: [
                    {origin_airport: oa},
                    {destination_airport: da},
                    {depature_date: dd},
                    {return_date: rd},
                    {total_passenger: tp}
                ]
            };
            const flight = await Flight.findAll(req.query)
            return res.status(200).json({
                status: true,
                data: flight
            })
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { origin_airport, destination_airport, depature_date, return_date, total_passenger,
                depature_time, arrival_time, duration_time, price } = req.body;
            // console.log(origin_airport)
            // console.log(req.user)
            // 
            const user_id = req.user.id
            // Read
            // const existFlight = await Flight.findOne({ where: {user_id: req.User.id }});
            // if (existFlight){
            //     return res.status(400).json({
            //         status: false,
            //         message: 'already create'
            //     });
            // }
            
            console.log(user_id)
            
            //Create
            const flight = await Flight.create({
                user_id,
                origin_airport,
                destination_airport,
                depature_date,
                return_date,
                total_passenger,
                airlines:'Garuda Indonesia',
                depature_time,
                arrival_time,
                duration_time, 
                price
        
            });

            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: flight
            })
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, origin_airport, destination_airport, depature_date, return_date, depature_time, arrival_time,duration_time } = req.body;
            const user_id = req.user.id
            const existFlight = await Flight.findOne({ where: {id: id }});
            if (!existFlight){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const flight = await Flight.update({
                user_id,
                origin_airport,
                destination_airport,
                depature_date,
                return_date,
                total_passenger,
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
                data: flight
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Flight.destroy({
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