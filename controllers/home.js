const { Home }= require ('../db/models')
const db  = require('../db/models/index')
const { QueryTypes } = require('sequelize')

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

            let offset = (tab-1)*4
            Home.findAll({where :{
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
            const { user_id, origin_airport, destination_airport, depature_date, arrival_date, return_date } = req.body;

            //Read
            const existHome = await Home.findOne({ where: {user_id: user_id }});
            if (existHome){
                return res.status(400).json({
                    status: false,
                    message: 'already create'
                });
            }

            //Create
            const home = await Home.create({
                user_id,
                origin_airport,
                destination_airport,
                depature_date,
                arrival_date,
                return_date
        
            });


            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: home
            })
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id, user_id, origin_airport, destination_airport, depature_date, arrival_date, return_date } = req.body;

            const existHome = await Home.findOne({ where: {id: id }});
            if (!existHome){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const home = await Home.update({
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
                data: home
            });
        }catch(err){
            next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try{
            const { id } = req.body;

            await Home.destroy({
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