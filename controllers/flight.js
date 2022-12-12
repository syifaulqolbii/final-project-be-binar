const { Flight, User, Search }= require ('../db/models')
const db  = require('../db/models/index')
const { QueryTypes, or } = require('sequelize')
const user = require('../db/models/user')

module.exports = {
    getData: async (req, res, next) => {
        try {
            // var id = req.params.id
            // let home = await db.sequelize.query(`SELECT "Users".name, "Users".role, "Users".gender 
            // FROM "Users" JOIN "Homes" ON "Users".id = "Homes".user_id WHERE "Users".id = ${id} ORDER BY "Users".id ASC `, {
            //     type: QueryTypes.SELECT
            // })
            // const homeOutput = await Home.findOne({ where : {user_id: req.params.id}})
            // if (home.length > 0) {
            //     res.status(200).json({
            //         message: 'Data is Loaded',
            //         homeOutput,
            //         data: home[0]
                    
            //     })
            // } else {
            //     res.status(200).json({
            //         message: 'Data Unknown',
            //         data: []
            //     })
            // }
            let tab = 1
            let oa = ''
            let da = ''
            let dd = ''
            let ad = ''
            let rd = ''
            let tp = ''
            if(req.query.tab){
                tab = req.query.tab
            }
            if(req.query.oa){
                oa = req.query.oa
            }
            if(req.query.da){
                da = req.query.da
            }
            if(req.query.dd){
                dd = req.query.dd
            }
            if(req.query.ad){
                ad = req.query.ad
            }
            if(req.query.rd){
                rd = req.query.rd
            }
            if(req.query.tp){
                tp = req.query.tp
            }
            console.log(req.query)
            let offset = (tab-1)*4
            Flight.findAll({where :{
                origin_airport : oa,
                destination_airport : da,
                depature_date: dd,
                arrival_date: ad,
                return_date: rd,
                total_passenger: tp
            },
            limit: 4,
            offset
            })
            .then(home =>{
                if(home.length == 0){
                    res.json({message: "Flight is not found", succes: true, data: {home}})
                }else{
                    res.json({message: "Found Flight", succes: true, data: {home}})
                }
            })
            
        } catch (err) {
            next(err)
        }
    },
    create: async (req, res, next) => {
        try {
            const { origin_airport, destination_airport, depature_date, arrival_date, return_date, total_passenger } = req.body;
            console.log(origin_airport)
            console.log(req.user)
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
                arrival_date,
                return_date,
                total_passenger
        
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
            const { id, user_id, origin_airport, destination_airport, depature_date, arrival_date, return_date } = req.body;

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
                arrival_date,
                return_date
        
            },
            {
                where:{
                    id
                }
            });


            return res.status(201).json({
                status: false,
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