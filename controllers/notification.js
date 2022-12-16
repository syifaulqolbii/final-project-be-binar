const { where } = require('sequelize');
const { Notification } = require('../db/models')

module.exports = {
    getData: async (req, res, next) => {
        try {
            const user_id = req.user.id
            const notification = await Notification.findAll({where: {user_id: user_id}});

            return res.status(200).json({
                data: notification
            });
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try{
            const { id } = req.params;

            const existNotification = await Notification.findOne({ where: {id: id }});

            if (!existNotification){
                return res.status(400).json({
                    status: false,
                    message: 'data is not found'
                });
            }
            const notification = await Notification.update({
                isRead : true
            },
            {
                where:{
                    id
                }
            });
            const updatedNotif = await Notification.findOne({ where: {id: id }});
            return res.status(201).json({
                status: false,
                message: 'Succes',
                data: {
                    id : updatedNotif.id,
                    isRead : updatedNotif.isRead
                }
            });
        }catch(err){
            next(err);
        }
    },
}