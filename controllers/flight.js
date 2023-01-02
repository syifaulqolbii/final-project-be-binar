const { Flight, User, Search, Sequelize } = require("../db/models");
const db = require("../db/models/index");
const { QueryTypes, or } = require("sequelize");
const user = require("../db/models/user");
// const { query } = require('express');
// const { query } = require('express')
const Op = Sequelize.Op;

module.exports = {
    getSearch: async (req, res, next) => {
        try {
        const { oa, da, dd, price } = req.query;

        let query = {
            where:{
                [Op.and]: [
                    { origin_airport: oa },
                    { destination_airport: da },
                    { depature_date: dd },
                ],
            }};

        if (price == 'asc'){
            query.order = [
                ['price', 'ASC']
            ]
        }

        if (price == 'desc'){
            query.order = [
                ['price', 'DESC']
            ]
        }

        const flight = await Flight.findAll(query);
        return res.status(200).json({
            status: true,
            data: flight,
        });
        } catch (err) {
        next(err);
        }
    },
    create: async (req, res, next) => {
        try {
        const {
            origin_airport,
            destination_airport,
            depature_date,
            return_date,
            total_passenger,
            depature_time,
            arrival_time,
            price,
        } = req.body;
        // console.log(origin_airport)
        // console.log(req.user)
        const user_id = req.user.id;
        // Read
        // const existFlight = await Flight.findOne({ where: {user_id: req.User.id }});
        // if (existFlight){
        //     return res.status(400).json({
        //         status: false,
        //         message: 'already create'
        //     });
        // }

        console.log(user_id);

        const timedt = new Date("1970-01-01T" + depature_time + "Z");
        const timeat = new Date("1970-01-01T" + arrival_time + "Z");

        let diff = timeat - timedt;
        if (diff < 0) {
            diff += 1440 * 60 * 1000;
        }
        const diffInHours = Math.floor(diff / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        //Create
        const flight = await Flight.create({
            origin_airport,
            destination_airport,
            depature_date,
            return_date,
            total_passenger,
            airlines: "Garuda Indonesia",
            depature_time,
            arrival_time,
            duration_time: `${diffInHours} Hours ${diffInMinutes} Minutes`,
            price,
        });

        return res.status(201).json({
            status: true,
            message: "Succes",
            data: flight,
        });
        } catch (err) {
        next(err);
        }
    },
    update: async (req, res, next) => {
        try {
        const {
            origin_airport,
            destination_airport,
            depature_date,
            total_passenger,
            price,
            return_date,
            depature_time,
            arrival_time,
            duration_time,
        } = req.body;
        const user_id = req.user.id;
        const { id } = req.params;
        const existFlight = await Flight.findOne({ where: { id: id } });
        if (!existFlight) {
            return res.status(400).json({
            status: false,
            message: "data is not found",
            });
        }
        const flight = await Flight.update(
            {
            origin_airport,
            destination_airport,
            depature_date,
            return_date,
            total_passenger,
            depature_time,
            arrival_time,
            duration_time,
            price,
            },
            {
            where: {
                id: id,
            },
            }
        );
        const resultFlight = await Flight.findOne({ where: { id: id } });
        return res.status(201).json({
            status: true,
            message: "Succes Edit Data",
            data: resultFlight,
        });
        } catch (err) {
        next(err);
        }
    },

    //Delete
    delete: async (req, res, next) => {
        try {
        const { id } = req.params;

        await Flight.destroy({
            where: {
            id: id,
            },
        });

        return res.status(201).json({
            message: "Succes Delete Data",
        });
        } catch (err) {
        next(err);
        }
    },
    getRouteById: async (req, res, next) => {
        try {
        const { id } = req.params;
        const flight = await Flight.findOne({
            where: {
            id: id,
            },
        });
        return res.status(200).json({
            status: true,
            data: flight,
        });
        } catch (error) {
        next(error);
        }
    }
};
